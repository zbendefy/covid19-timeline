function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status==200) {
        result = xmlhttp.responseText;
    }
    return result;
}

function splitCsvLine(line){
    ret = [];
    let isEscaped = false;
    let currentEntry = "";
    for(let i = 0; i < line.length; ++i){
        if (line[i] == "," && !isEscaped){
            ret.push(currentEntry);
            currentEntry = "";
            continue;
        } else if (line[i] == '"'){
            isEscaped = !isEscaped;
        }
        currentEntry += line[i];
    }
    ret.push(currentEntry);
    return ret;
}


function ConvertDate(dateStr){
    [month, day, year] = dateStr.split("/");
    year = "20" + year;
    let date = new Date(year, month - 1, day);
    return date.toDateString();
}

function parseCsv(csv){
    const lines=csv.split("\n");
    let result = [];
    let headers=splitCsvLine(lines[0]);
  
    for(let i=1;i<lines.length;i++){
  
        let obj = {};
        let currentline=splitCsvLine(lines[i]);
  
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
  
        result.push(obj);
    }
    return result;
}

function CompileData(csv_infected, csv_deaths, csv_recovered){
    let ret = {};
    
    let csvData_Cases = parseCsv(csv_infected);
	let csvData_Deaths = parseCsv(csv_deaths);
	let csvData_Recovered = parseCsv(csv_recovered);

    for (let d of csvData_Cases){
        ret[ d["Country/Region"] + ";" + d["Province/State"] ] = {infected:"0", dead:"0", recovered:"0"};
        ret[ d["Country/Region"] + ";" + d["Province/State"] ].infected = d;
    }

    for (let d of csvData_Deaths){
        if ( ret[ d["Country/Region"] + ";" + d["Province/State"] ] === undefined )
            ret[ d["Country/Region"] + ";" + d["Province/State"] ] = {infected:"0", dead:"0", recovered:"0"};
        ret[ d["Country/Region"] + ";" + d["Province/State"] ].dead = d;
    }

    for (let d of csvData_Recovered){
        if ( ret[ d["Country/Region"] + ";" + d["Province/State"] ] === undefined )
            ret[ d["Country/Region"] + ";" + d["Province/State"] ] = {infected:"0", dead:"0", recovered:"0"};
        ret[ d["Country/Region"] + ";" + d["Province/State"] ].recovered = d;
    }

    return ret;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getLatestAvailableData( datapoints, timeEntries, currentTimeline ){
    if (datapoints == undefined)
        return 0;
    let actualTimelineId = currentTimeline;
    while( datapoints[timeEntries[actualTimelineId]] === undefined && actualTimelineId > 0)
      --actualTimelineId;
    let ret = Number.parseInt( datapoints[timeEntries[actualTimelineId]] );
    return Number.isNaN(ret) ? 0 : ret;
}

function parseTimeline(csv){
    const lines=csv.split("\n");
    let headers=lines[0].split(",");
    return headers.slice(4);
}

function GetTotalCases(category, parsedData, timeEntries, timeEntryId){
    let total = 0;
    for(let data of Object.values(parsedData)){
        total += getLatestAvailableData(data[category], timeEntries, timeEntryId);
    }
    return total;
}