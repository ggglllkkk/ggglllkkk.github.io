var subjects=[["Maths", 9, [["DS", 4], ["Tests", 1, 5]]], ["Physique", 7, [["DS", 4], ["Tests", 1]]], ["Chimie", 4, [["tests", 1], ["DS", 4]]], ["Bio", 2, [["tests", 1]]], ["Info", 2, [["tests", 1]]], ["Anglais", 1.5, [["tests", 1]]], ["LV2", 1.5, [["tests", 1]]], ["Sport", 1.5, [["tests", 1]]], ["Culture G", 1.5, [["tests", 1]]]];
var objects=[];//[[column, table, subjectAverage],]
var notes=[];
var errorMessages=[];
var averageValue=NaN;
var isMobileBrowser=false;
var isParameterMenuOpen=false;


var errorMessageObject=document.getElementById("errorMessages");
var averageObject=document.getElementById("average");
var outOf20=document.getElementById("outOf20");
var bodyObject=document.getElementsByTagName("body")[0];


var gradientCoeffs=[ [0.34,-10.7,64.6,256],
                    [-0.28,6.2,-12.3,-1.4],
                    [-0.18,6.66,-46.6,4.3]
]
var defaultSubjects=[[["Maths", 7, [["DS", 4], ["Tests", 1, 5]]], ["Physique", 7, [["DS", 4], ["Tests", 1]]], ["Chimie", 4, [["tests", 1]]], ["Bio", 3, [["tests", 1]]], ["Info", 3, [["tests", 1]]], ["Anglais", 1.5, [["tests", 1]]], ["LV2", 1.5, [["tests", 1]]], ["Sport", 1.5, [["tests", 1]]], ["Culture G", 1.5, [["tests", 1]]]], []];

var currentAngle=100;
var anglesList=[0];
for(i=1;i<99;i++){
    let rotateDegree=-0.00216021602*Math.pow(i,2)+0.21602160216*i;
    anglesList.push(anglesList[anglesList.length-1]+rotateDegree);
}
anglesList.push(360);


function showInfo(){
    document.getElementById("dialogBox").innerHTML="Cet outil de calcul de la moyenne s'appuie sur des coefficients pouvant ne pas être représentatifs de la réalité, la moyenne ainsi calculée peut donc ne pas valoir celle calculée officiellement.";
    document.getElementById("dialogBox").show();
    setTimeout(()=> document.getElementById("dialogBox").close(), 5000);
}


function addNewSubSubject(element){
    console.log(element)
    let index=element.target.parentNode.id.replace("addSubSubjectBox;", "");

    let newSubSubjectName=element.target.parentNode.childNodes[0].value;
    let newSubjectCoeff=element.target.parentNode.childNodes[1].value;
    let newSubSubjectOn=element.target.parentNode.childNodes[2].value;

    if(newSubSubjectOn!=""){subjects[index][2].push([newSubSubjectName, parseFloat(newSubjectCoeff), parseFloat(newSubSubjectOn)]);}
    else{subjects[index][2].push([newSubSubjectName, parseFloat(newSubjectCoeff)]);}

    initialize(true);
}

function createNewParameterBoxAddSubjectBox(k){
    let addSubSubjectBox=document.createElement("div");
    addSubSubjectBox.id="addSubSubjectBox;"+k;
    addSubSubjectBox.classList.add("addSubSubjectBox");

    let newSubSubjectName=document.createElement("input");
    newSubSubjectName.type="text";
    newSubSubjectName.placeholder="nom de la catégorie";
    newSubSubjectName.classList.add("changeSubSubjectName");

    let newSubSubjectCoeff=document.createElement("input");
    newSubSubjectCoeff.type="text";
    newSubSubjectCoeff.placeholder="coeff";
    newSubSubjectCoeff.classList.add("changeSubSubjectCoeff");
    newSubSubjectCoeff.style.width="60px";
    if(isMobileBrowser){newSubSubjectCoeff.style.width="100px"};

    let newSubSubjectOn=document.createElement("input");
    newSubSubjectOn.type="text";
    newSubSubjectOn.placeholder="notes sur";
    newSubSubjectOn.classList.add("changeSubSubjectOn");
    newSubSubjectOn.style.width="60px";
    if(isMobileBrowser){newSubSubjectOn.style.width="100px"};

    let newSubSubjectButton=document.createElement("input");
    newSubSubjectButton.type="image";
    newSubSubjectButton.src="data/plusButton.png";
    newSubSubjectButton.addEventListener("click", element=> addNewSubSubject(element));

    addSubSubjectBox.appendChild(newSubSubjectName);
    addSubSubjectBox.appendChild(newSubSubjectCoeff);
    addSubSubjectBox.appendChild(newSubSubjectOn);
    addSubSubjectBox.appendChild(newSubSubjectButton);
    
    return addSubSubjectBox;
}

function createNewParameterBoxSubSubject(k,i){
    let subSubjectBox=document.createElement("div");
    subSubjectBox.id="idSubSubjectBox;"+k+";"+i;

    let subSubjectOrder=document.createElement("select");
    subSubjectOrder.classList.add("changeSubSubjectOrder");
    subSubjectOrder.style.color="#16161d";
    subSubjectOrder.style.width="50px";
    for (let j in subjects[k][2]){
        let tempOption=document.createElement("option");
        tempOption.value=parseInt(j);
        tempOption.innerHTML=parseInt(j)+1;
        if(j==i){tempOption.selected=true;}
        subSubjectOrder.appendChild(tempOption);
    }
    subSubjectOrder.addEventListener("change", element=> modifiedSubSubject(element));

    let subSubjectName=document.createElement("input");
    subSubjectName.value=subjects[k][2][i][0];
    subSubjectName.classList.add("changeSubSubjectName");
    subSubjectName.addEventListener("input", element=> modifiedSubSubject(element));

    let subSubjectCoeff=document.createElement("input");
    subSubjectCoeff.value=subjects[k][2][i][1];
    subSubjectCoeff.classList.add("changeSubSubjectCoeff");
    subSubjectCoeff.style.width="40px";
    if(isMobileBrowser){subSubjectCoeff.style.width="80px"};
    subSubjectCoeff.addEventListener("input", element=> modifiedSubSubject(element));

    let subSubjectOn=document.createElement("input");
    if(subjects[k][2][i][2]){subSubjectOn.value=subjects[k][2][i][2];}
    //else{subSubjectOn.value=20;}
    subSubjectOn.placeholder="20";
    subSubjectOn.classList.add("changeSubSubjectOn");
    subSubjectOn.style.width="40px";
    if(isMobileBrowser){subSubjectOn.style.width="80px"};
    subSubjectOn.addEventListener("input", element=> modifiedSubSubject(element));

    subSubjectBox.appendChild(subSubjectOrder);
    subSubjectBox.appendChild(document.createTextNode("   Catégorie: "));
    subSubjectBox.appendChild(subSubjectName);
    subSubjectBox.appendChild(document.createTextNode("   Coeff : "));
    subSubjectBox.appendChild(subSubjectCoeff);
    subSubjectBox.appendChild(document.createTextNode("   Note sur : "));
    subSubjectBox.appendChild(subSubjectOn);

    return subSubjectBox;
}

function createNewParameterBoxSubject(k){
    let subjectNameBox=document.createElement("div");
    subjectNameBox.id="idSubject;"+k;

    let subjectOrder=document.createElement("select");
    subjectOrder.classList.add("changeSubjectOrder");
    subjectOrder.style.color="#16161d";
    subjectOrder.style.width="50px";
    for(let i in subjects){
        let tempOption=document.createElement("option");
        tempOption.value=parseInt(i);
        tempOption.innerHTML=parseInt(i)+1;
        if(i==k){tempOption.selected=true;}
        subjectOrder.appendChild(tempOption);
    }
    subjectOrder.addEventListener("change", element=> modifiedSubject(element));

    let subjectName=document.createElement("input");
    subjectName.value=subjects[k][0];
    subjectName.classList.add("changeSubjectName");
    subjectName.addEventListener("input", element=> modifiedSubject(element));

    let subjectCoeff=document.createElement("input");
    subjectCoeff.value=subjects[k][1];
    subjectCoeff.classList.add("changeSubjectCoeffInput");
    subjectCoeff.style.width="40px";
    if(isMobileBrowser){subjectCoeff.style.width="80px";}
    subjectCoeff.addEventListener("input", element=> modifiedSubject(element));

    subjectNameBox.appendChild(subjectOrder);
    subjectNameBox.appendChild(document.createTextNode("   Nom de la Matière : "));
    subjectNameBox.appendChild(subjectName);
    subjectNameBox.appendChild(document.createTextNode("   Coeff : "));
    subjectNameBox.appendChild(subjectCoeff);

    return subjectNameBox;
}

function modifiedSubSubject(element){
    let boxId=element.target.parentNode.id;
    let indexes=boxId.replace("idSubSubjectBox;", "").split(";");
    let index=indexes[1];
    let newIndex=document.getElementById(boxId).childNodes[0].value;
    
    let subSubjectsArray=subjects[indexes[0]][2][index];
    subjects[indexes[0]][2].splice(index, 1);
    subjects[indexes[0]][2].splice(newIndex, 0, subSubjectsArray);

    let notesArray=notes[indexes[0]][index];
    notes[indexes[0]].splice(index, 1);
    notes[indexes[0]].splice(newIndex, 0, notesArray);

    subjects[indexes[0]][2][newIndex][0]=document.getElementById(boxId).childNodes[2].value;
    subjects[indexes[0]][2][newIndex][1]=parseFloat(document.getElementById(boxId).childNodes[4].value);
    if(document.getElementById(boxId).childNodes[6].value!=""){subjects[indexes[0]][2][newIndex][2]=parseFloat(document.getElementById(boxId).childNodes[6].value);}

    document.getElementById("preSelectionMenu").value="-1";

    initialize();
}

function modifiedSubject(element){
    let boxId=element.target.parentNode.id;
    let index=parseInt(boxId.replace("idSubject;", ""));
    let newIndex=document.getElementById(boxId).childNodes[0].value;

    let subjectArray=subjects[index];
    subjects.splice(index, 1);
    subjects.splice(newIndex, 0, subjectArray);

    let notesArray=notes[index]

    notes.splice(index, 1);
    notes.splice(newIndex, 0, notesArray);

    subjects[newIndex][0]=document.getElementById(boxId).childNodes[2].value;
    subjects[newIndex][1]=parseFloat(document.getElementById(boxId).childNodes[4].value);

    document.getElementById("preSelectionMenu").value="-1";
    //subjects[index][0]=value;
    initialize(index!=newIndex);
}

function addNewSubject(){
    subjects.push([document.getElementById("newSubjectName").value, parseFloat(document.getElementById("newSubjectCoeff").value), []]);
    document.getElementById("newSubjectName").value="";
    document.getElementById("newSubjectCoeff").value="";

    console.log(subjects)

    let parametersDiv=document.createElement("div");
    parametersDiv.classList.add("subjectModifyingBox");
    parametersDiv.appendChild(createNewParameterBoxSubject(subjects.length-1));
    document.getElementById("modifySubjectsBox").appendChild(parametersDiv);

    initialize(true);
}

function changePreselection(){
    let value=document.getElementById("preSelectionMenu").value
    if(value!="-1"){subjects=defaultSubjects[parseInt(value)];}
    if(value=="1"){notes=[];localStorage.setItem("notes", JSON.stringify([]));}

    initialize(true);
}

function openCloseParameterMenu(){
    var paramBox=document.getElementById("parametersBox")
    if(isParameterMenuOpen==false){
        paramBox.style.right=String(-paramBox.offsetWidth*((anglesList[currentAngle]/360)))+"px";
        document.getElementById("parameterButton").style.transform="rotate("+String(-anglesList[currentAngle])+"deg)";
    }
    else{
        paramBox.style.right=String(paramBox.offsetWidth*((anglesList[currentAngle]/360)-1))+"px";
        document.getElementById("parameterButton").style.transform="rotate("+String(anglesList[currentAngle])+"deg)";
    }
    currentAngle+=1;
}

function changeParameters(){
    temp=setTimeout(";");
    for(i=0;i<=temp;i++){clearInterval(i);clearTimeout(i);}

    document.getElementById("parametersBox").style.display="flex";
    isParameterMenuOpen=!isParameterMenuOpen;
    currentAngle=0;
    a=setInterval(openCloseParameterMenu, 10);
    setTimeout(()=>{clearInterval(a);if(isParameterMenuOpen==false){document.getElementById("parametersBox").style.display="none";}}, 2000);
}

function exportData(){
    navigator.clipboard.writeText(JSON.stringify(notes));
    document.getElementById("dialogBox").innerHTML="Les données ont été copiées.";
    document.getElementById("dialogBox").show();
    setTimeout(()=> document.getElementById("dialogBox").close(), 2000);
}

function importData(){
    initialize();
    retrieveNotes(JSON.parse(document.getElementById("dataToImport").value));
    document.getElementById("dataToImport").value="";
    calculAverage();
}

function cleanPage(){
    //console.log("clean page")
    notes=[];
    localStorage.setItem("notes", JSON.stringify([]));

    initialize(true);
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

function initialize(firstTime=false){
    tempNotes=notes;

    objects=[];
    notes=[];
    document.getElementById("tables").innerHTML="";
    if(firstTime){
        document.getElementById("modifySubjectsBox").innerHTML="";}

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

        if(firstTime){

            let parametersDiv=document.createElement("div");
            parametersDiv.classList.add("subjectModifyingBox");
            parametersDiv.appendChild(createNewParameterBoxSubject(k));

            let subSubjectsBox=document.createElement("div");
            subSubjectsBox.style.marginLeft="50px";
            subSubjectsBox.appendChild(createNewParameterBoxAddSubjectBox(k));
            for(let i in subjects[k][2]){
                subSubjectsBox.appendChild(createNewParameterBoxSubSubject(k,i));
            }
            parametersDiv.appendChild(subSubjectsBox);

            document.getElementById("modifySubjectsBox").appendChild(parametersDiv);
        }
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
        /*for(i=0; i<inputs.length; i++){
            console.log(inputs[i]);
            let parentId=inputs[i].parentNode.id;
            if(true){inputs[i].style.fontSize="xx-large";}
            //if(inputs[i].parentNode.id.includes("idSubject")==false && inputs[i].parentNode.id!="createNewSubjectBox"){inputs[i].style.fontSize="xx-large";}
        }*/

        document.getElementById("cleanButton").style.fontSize="30px";
        document.getElementById("importDataButton").style.fontSize="20px";
        document.getElementById("exportDataButton").style.fontSize="20px";
        document.getElementById("infoButton").style.height="30px";
        document.getElementById("dialogBox").style.fontSize="20px";

        document.getElementById("mainBody").style.top="10pt";
        document.getElementById("mainBody").style.bottom="10pt";
        
        document.getElementById("firstLine").style.height="100px";
        document.getElementById("parameterButton").style.height="80px";
        document.getElementById("parameterButton").style.width="80px";

        document.getElementById("parametersBox").style.width="95%";
        document.getElementById("parametersBox").style.fontSize="40px";
        document.getElementById("parametersBox").style.paddingTop="70px";
        document.getElementById("createNewSubjectBox").style.height="50px";
        document.getElementById("preSelectionMenu").style.fontSize="20px"
        document.getElementById("preselectionBox").style.fontSize="40px";
        document.getElementById("newSubjectName").style.fontSize="30px";
        document.getElementById("newSubjectCoeff").style.fontSize="30px";

        for(i=0; i<document.getElementsByClassName("changeSubjectName").length; i++){document.getElementsByClassName("changeSubjectName")[i].style.fontSize="30px";}
        for(i=0; i<document.getElementsByClassName("changeSubjectCoeffInput").length; i++){document.getElementsByClassName("changeSubjectCoeffInput")[i].style.fontSize="20px";document.getElementsByClassName("changeSubjectCoeffInput")[i].style.width="50px";}
        for(i=0; i<document.getElementsByClassName("changeSubjectOrder").length; i++){document.getElementsByClassName("changeSubjectOrder")[i].style.fontSize="20px";}
        for(i=0; i<document.getElementsByClassName("addSubSubjectBox").length; i++){document.getElementsByClassName("addSubSubjectBox")[i].style.height="50px";}
    }

    document.getElementById("cleanButton").addEventListener("click", cleanPage);
    document.getElementById("importDataButton").addEventListener("click", importData);
    document.getElementById("exportDataButton").addEventListener("click", exportData);
    document.getElementById("infoButton").addEventListener("click", showInfo)
    document.getElementById("parameterButton").addEventListener("click", changeParameters);
    document.getElementById("preSelectionMenu").addEventListener("change", changePreselection);
    document.getElementById("addNewSubjectButton").addEventListener("click", addNewSubject)

    retrieveNotes(tempNotes);
    if(firstTime){retrieveNotes(JSON.parse(localStorage.getItem("notes")));}
    calculAverage();

    console.log(objects, notes);
}

document.body.onload=initialize(true);
