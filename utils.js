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

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getLatestAvailableData( datapoints, timeEntries, currentTimeline ){
    let actualTimelineId = currentTimeline;
    while( datapoints[timeEntries[actualTimelineId]] === undefined && actualTimelineId > 0)
      --actualTimelineId;
    return Number.parseInt( datapoints[timeEntries[actualTimelineId]] );
}

function parseTimeline(csv){
    const lines=csv.split("\n");
    let headers=lines[0].split(",");
    return headers.slice(4);
}

function GetTotalCases(parsedData, timeEntries, timeEntryId){
    let total = 0;
    for(let i = 0; i < parsedData.length; ++i){
        total += getLatestAvailableData(parsedData[i], timeEntries, timeEntryId);
    }
    return total;
}