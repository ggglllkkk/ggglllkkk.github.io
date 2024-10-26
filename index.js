var subjects=[["Maths", 7, [["DS", 4], ["Tests", 1, 5]]], ["Physique", 7, [["DS", 4], ["Tests", 1]]], ["Chimie", 4, [["tests", 1]]], ["Bio", 3, [["tests", 1]]], ["Info", 3, [["tests", 1]]], ["Anglais", 1.5, [["tests", 1]]], ["LV2", 1.5, [["tests", 1]]], ["Sport", 1.5, [["tests", 1]]], ["Culture G", 1.5, [["tests", 1]]]];
var objects=[];//[[column, table],]
var notes=[];
var errorMessages=[];
var averageValue=NaN;
var isMobileBrowser=false;

var gradientCoeffs=[ [0.34,-10.7,64.6,256],
                    [-0.28,6.2,-12.3,-1.4],
                    [-0.18,6.66,-46.6,4.3]
]

var errorMessageObject=document.getElementById("errorMessages");
var averageObject=document.getElementById("average");
var outOf20=document.getElementById("outOf20");
var bodyObject=document.getElementsByTagName("body")[0];

var currentAngle=100;
var anglesList=[0]
for(i=1;i<99;i++){
    let rotateDegree=-0.00216021602*Math.pow(i,2)+0.21602160216*i;
    anglesList.push(anglesList[anglesList.length-1]+rotateDegree);
}
anglesList.push(360);

function turnObject(){
    document.getElementById("parameterButton").style.transform="rotate("+String(anglesList[currentAngle])+"deg)";
    currentAngle+=1;
}

function changeParameters(){
    temp=setTimeout(";");
    for(i=0;i<=temp;i++){clearInterval(i);clearTimeout(i);}

    currentAngle=0;
    a=setInterval(turnObject, 10);
    setTimeout(()=>clearInterval(a), 1600);
}

function exportData(){
    navigator.clipboard.writeText(JSON.stringify(notes));
    document.getElementById("dialogBox").innerHTML="Les données ont été copiées.";
    document.getElementById("dialogBox").show();
    setTimeout(()=> document.getElementById("dialogBox").close(), 2000);
}

function importData(){
    initialize(false);
    retrieveNotes(JSON.parse(document.getElementById("dataToImport").value));
    document.getElementById("dataToImport").value="";
    calculAverage();
}

function cleanPage(){
    //console.log("clean page");
    initialize(false);
    calculAverage();
}

function retrieveNotes(retrievedNotes){
    if(retrievedNotes){
        for(let k in retrievedNotes){
            for(let n in retrievedNotes[k]){
                for(let i in retrievedNotes[k][n]){
                    let value=retrievedNotes[k][n][i]
                    if(value!=""){
                        let fakeInput=document.createElement("input");
                        fakeInput.target=document.getElementById("idInput;"+k+";"+n+";"+i);
                        document.getElementById("idInput;"+k+";"+n+";"+i).value=value;
                        inputModified(fakeInput);
                    }
                }
            }
        }

    }
}

function calculAverage(){
    //console.log("average calculus");
    var ponderedValueSum=0;
    var ponderationSum=0;

    var subjectAverage;
    var subjectPonderation;
    var testTypeAverage;
    var value;
    var valueOnHundred;
    var noteOn;

    for(let k in notes){
        subjectAverage=0;
        subjectPonderation=0;
        for (let n in notes[k]){
            testTypeAverage=0;
            numberOfNotes=0;
            for (let i in notes[k][n]){
                value=notes[k][n][i]
                if(value!="" && /^[0-9.,/]+$/.test(value)){
                    if (value.indexOf("/")!=-1){
                        const a=value.split("/")
                        noteOn=parseFloat(a[1]);
                        value=parseFloat(a[0]);
                    }
                    else{
                        noteOn=subjects[k][2][n][2];
                        if(noteOn==undefined){noteOn=20;}
                    }

                    if(parseFloat(value)<=noteOn){
                        valueOnHundred=value*(100/noteOn);
                        testTypeAverage+=valueOnHundred;
                        //console.log(value, valueOnHundred, noteOn)
                        numberOfNotes++;
                    }
                }

                //console.log("i", i, testTypeAverage)
            }

            if(numberOfNotes!=0){
                testTypeAverage=testTypeAverage/(numberOfNotes)
                subjectAverage+=testTypeAverage*subjects[k][2][n][1];
                subjectPonderation+=subjects[k][2][n][1];}

            //console.log("n", n, testTypeAverage, subjectAverage, subjects[k][2][n][1], numberOfNotes);
        }
        objects[k][2].style.visibility="collapse";
        objects[k][2].childNodes[0].innerHTML="";
        objects[k][2].childNodes[1].innerHTML="";
        if(subjectPonderation!=0){
            subjectAverage=subjectAverage/subjectPonderation;
            ponderedValueSum+=subjectAverage*subjects[k][1];
            ponderationSum+=subjects[k][1]};

            if (subjectAverage!=0){
                objects[k][2].childNodes[0].innerHTML=(subjectAverage/5).toFixed(2);
                objects[k][2].style.visibility="visible";
                objects[k][2].childNodes[1].innerHTML="/20";
            }

        //console.log("k", k, subjectAverage, subjectPonderation)
    }

    averageValue=ponderedValueSum/ponderationSum;
    averageValue=averageValue/5

    /*
    if(averageValue<8){bodyObject.style.backgroundColor="#FF0000";}
    else if(averageValue>=8 && averageValue<10){bodyObject.style.backgroundColor="#ED7F10";}
    else{bodyObject.style.backgroundColor="#00FF00";}*/

    let rgbColors=["","",""];

    for (let k in gradientCoeffs){
        let a=0
        for (let n in gradientCoeffs[k]){
            a+=Math.pow(averageValue,n)*gradientCoeffs[k][3-n]
        }
        rgbColors[k]=String(a)
    }

    bodyObject.style.backgroundColor="rgb("+rgbColors[0]+","+rgbColors[1]+","+rgbColors[2]+")";

    if(ponderationSum!=0){
        averageObject.innerHTML=averageValue.toFixed(2);
        outOf20.style.visibility="visible";
    }
    else{
        averageObject.innerHTML="";
        outOf20.style.visibility="collapse";
        bodyObject.style.backgroundColor="#FFFFFF";
    }

    const stringifiedNotes=JSON.stringify(notes);
    localStorage.setItem("notes", stringifiedNotes);
}

function printErrorMessages(){
    var errorMessageString="";

    for (let k in errorMessages){
        em=errorMessages[k];
        if (em[0]==0){ // letters in inputs
            errorMessageString+=("Il n'y a pas que des nombres dans la case "+subjects[em[1][0]][0]+", "+subjects[em[1][0]][2][em[1][1]][0]+", ligne "+String(parseInt(em[1][2])+1)+"... >:( !");
        }

        errorMessageString+="<br>";
    }
    errorMessageObject.innerHTML=errorMessageString;
}

function inputModified(element){
    //console.log(element);
    //console.log("NEW INPUT");
    var indexes=element.target.id.replace("idInput;", "").split(";");
    var value=element.target.value.replace(",", ".");

    var isValueNumber=true;
    for(let k in value){if("0123456789.,/".includes(value[k])==false){isValueNumber=false;}}

    var isInErrorMessages=-1;
    for(let k in errorMessages){
        em=errorMessages[k];
        if(em[0]==0 && em[1][0]==indexes[0] && em[1][1]==indexes[1] && em[1][2]==indexes[2]){
            isInErrorMessages=k;
        }
    }

    if(isValueNumber==false){if(isInErrorMessages==-1){errorMessages.push([0, indexes]);}}
    else if(isInErrorMessages!=-1){errorMessages.splice(isInErrorMessages, 1);}

    notes[indexes[0]][indexes[1]][indexes[2]]=value;

    var isLastLineFilled=false;
    for(let k in notes[indexes[0]]){isLastLineFilled=(isLastLineFilled || !Object.is(notes[indexes[0]][k][notes[indexes[0]][k].length-1], ""));}

    var currentTable=objects[indexes[0]][1].childNodes[0].childNodes[indexes[1]].childNodes[0];

    if(isLastLineFilled){
        //console.log("expand");
        var line=document.createElement("tr");

        let inputCase=document.createElement("td");
        let inputZone=document.createElement("input");
        inputZone.type="text";
        //inputZone.inputMode="decimal";
        if(subjects[indexes[0]][2][indexes[1]].length==3){inputZone.placeholder="/"+String(subjects[indexes[0]][2][indexes[1]][2]); }
        else{inputZone.placeholder="/20";}
        inputZone.addEventListener("input", element => inputModified(element));
        inputZone.addEventListener("change", element => inputModified(element));
        inputZone.id="idInput;"+indexes[0]+";"+indexes[1]+";"+String(parseInt(indexes[2])+1);
        if(isMobileBrowser){inputZone.style.fontSize="xx-large";}
        
        inputCase.appendChild(inputZone);
        line.appendChild(inputCase);

        notes[indexes[0]][indexes[1]].push("");

        currentTable.appendChild(line);
    }

    var maxFilledLine=-1;
    for(let k in notes[indexes[0]][indexes[1]]){
        if(!Object.is(notes[indexes[0]][indexes[1]][k], "")){
                maxFilledLine=parseInt(k);
        }
    }

    if(value==""){
        //console.log("reduction", maxFilledLine, currentTable.childNodes.length, objects);

        if(currentTable.childNodes.length==maxFilledLine+4){
            //console.log("removing last line");

            currentTable.removeChild(currentTable.childNodes[maxFilledLine+3]);
            notes[indexes[0]][indexes[1]].splice(maxFilledLine+2);
        }
        else if(maxFilledLine<currentTable.childNodes.length-3){
            notes[indexes[0]][indexes[1]].splice(maxFilledLine+2);

            const linesToRemove=currentTable.childNodes.length-3;
            for(let i=0; i<=linesToRemove; i++){
                currentTable.removeChild(currentTable.childNodes[maxFilledLine+3]);
            }
        }
    }

    printErrorMessages();
    calculAverage();
}

function initialize(firstTime){
    objects=[];
    notes=[];
    document.getElementById("tables").innerHTML="";

    var cssFile=document.createElement("link");
    cssFile.href="style.css";
    cssFile.rel="stylesheet";
    cssFile.type="text/css";
    document.getElementsByTagName("head")[0].appendChild(cssFile);

    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) isMobileBrowser = true;})(navigator.userAgent||navigator.vendor||window.opera);

    for (let k in subjects){
        var column=document.createElement("div");
        column.classList.add("column");
        column.appendChild(document.createTextNode(subjects[k][0]+", coeff: "+String(subjects[k][1])));

        var table=document.createElement("table");
        var tableLine=document.createElement("tr");
        tableLine.classList.add("subSubjectTableLine");
        var notesArray=[];

        for (let n in subjects[k][2]){
            let subColumn=document.createElement("td")
            let subTable=document.createElement("table");
            subTable.style.objectPosition="top";
            let header=document.createElement("tr");
            let inputCase=document.createElement("tr");

            let subHeader=document.createElement("th");
            subHeader.appendChild(document.createTextNode(subjects[k][2][n][0]+", coeff: "+String(subjects[k][2][n][1])));
            header.appendChild(subHeader);

            let subInputCase=document.createElement("td");
            let inputZone=document.createElement("input");
            inputZone.type="text";
            //inputZone.inputMode="decimal";
            if(subjects[k][2][n].length==3){inputZone.placeholder="/"+String(subjects[k][2][n][2]); }
            else{inputZone.placeholder="/20";}
            inputZone.addEventListener("input", element => inputModified(element));
            inputZone.addEventListener("change", element => inputModified(element));
            inputZone.id="idInput;"+k+";"+n+";0";
            subInputCase.appendChild(inputZone);
            inputCase.appendChild(subInputCase);

            subTable.appendChild(header);
            subTable.appendChild(inputCase);
            subColumn.append(subTable);
            tableLine.appendChild(subColumn);

            notesArray.push([""]);
        }
        table.appendChild(tableLine);
        column.appendChild(table);

        let subjectAverageObject=document.createElement("div");
        subjectAverageObject.style.textAlign="right";
        subjectAverageObject.style.marginRight="5px";
        subjectAverageObject.style.visibility="collapse";

        let subjectAverageText=document.createElement("text");
        subjectAverageText.classList.add("subjectOutOf20");
        subjectAverageObject.appendChild(subjectAverageText);

        let subjectAverageOutOf20=document.createElement("text");
        subjectAverageObject.appendChild(subjectAverageOutOf20);
        column.appendChild(subjectAverageObject);

        objects.push([column, table, subjectAverageObject]);
        document.getElementById("tables").appendChild(column);

        notes.push(notesArray);
    }
    
    if(isMobileBrowser==true){
        document.getElementById("tables").style.flexFlow="column wrap";
        for(let k in objects){
            //objects[k][0].style.width="100%";
            objects[k][0].style.fontSize="50px ";
        }
        document.getElementById("errorMessages").style.fontSize="xx-large";
        document.getElementsByTagName("h1")[0].style.fontSize="50px";
        
        const inputs=document.getElementsByTagName("input");
        for(i=0; i<inputs.length; i++){inputs[i].style.fontSize="xx-large";}

        document.getElementById("cleanButton").style.fontSize="30px";
        document.getElementById("importDataButton").style.fontSize="20px";
        document.getElementById("exportDataButton").style.fontSize="20px";
        document.getElementById("dialogBox").style.fontSize="20px";

        document.getElementById("mainBody").style.top="10pt";
        document.getElementById("mainBody").style.bottom="10pt";
        
        document.getElementById("firstLine").style.height="100px";
        document.getElementById("parameterButton").style.height="80px";
        document.getElementById("parameterButton").style.width="80px";
    }

    document.getElementById("cleanButton").addEventListener("click", cleanPage);
    document.getElementById("importDataButton").addEventListener("click", importData);
    document.getElementById("exportDataButton").addEventListener("click", exportData);
    document.getElementById("parameterButton").addEventListener("click", changeParameters);

    if(firstTime){retrieveNotes(JSON.parse(localStorage.getItem("notes")));}

    console.log(objects, notes);
}

document.body.onload=initialize(true);