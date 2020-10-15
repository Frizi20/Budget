var btn = document.querySelector('.btn_add');
var bugetTotal = document.querySelector('.buget-total');
var venituriTotale = document.querySelector('.venituri-valori');
var cheltuieli = document.querySelector('.cheltuieli-valori');
var procentCheltuieli = document.querySelector('.procent-cheltuieli');
var domMonth = document.querySelector('.luna-actuala');
var months = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];
var m = new Date().getMonth();
var currentMonth = months[m];

//Show current month in dom

domMonth.textContent = currentMonth;


//Object function for each item

var Venit = function(descriere,valoare,id){
    this.descriere = descriere;
    this.valoare = valoare;
    this.id = id;
}

var Cheltuiala = function(descriere,valoare,id){
    this.descriere= descriere;
    this.valoare = valoare;
    this.id = id;
    this.procent= -1;

    
}

Cheltuiala.prototype.calcPro = function(){
    if (data.total.venituri < 0){
        this.procent = -1;
    }else{
        this.procent = Number (this.valoare / data.total.venituri * 100).toFixed(2)
    }
}

var data = {
    iteme: {
      ven:[],
      che:[]
    },
    total:{
        venituri:0,
        cheltuieli:0

    },
    procent:0,
    buget:0
    
}

showBuget();

//Get data on click

document.addEventListener('keydown',function(e){
    if(e.keyCode === 13){
        start();
    }
})

btn.addEventListener('click',start);


//delete Event

document.querySelector('.bottom-container').addEventListener('click',function(e){

    if(e.target.id === 'delete-btn'){

        var idNumber = e.target.parentNode.parentNode.id;
        var tip = idNumber.split('-')[0];
        var ID = idNumber.split('-')[1];
        var index;

        if(tip ==='venit'){

            // Valoarea itemului este 0 cand e sters
            data.iteme.ven[ID].valoare=0;

            e.target.parentNode.parentNode.style.display = 'none';


        }else if(tip === 'cheltuiala'){

            data.iteme.che[ID].valoare=0;
            e.target.parentNode.parentNode.style.display = 'none';
        }

        calc();

    }
    
})


function start(){

    //Valorile tipului,descriere si valoare
    
    var descriere = document.querySelector('.descriere').value;
    var valoare = document.querySelector('.valoare').value;
    var tip = document.querySelector('.type').value;


    //ID unic pt fiecare item

    if(descriere !== '' && valoare !== '' && parseInt(valoare) > 1){
        var ID;

        if(data.iteme[tip].length > 0){
            ID = data.iteme[tip][data.iteme[tip].length - 1].id + 1;
        }else{
            ID = 0;
        }

        //Crearea unui obiect pt venit sau cheltuiala

        if(tip === 'che'){
            data.iteme.che.push(new Cheltuiala(descriere,parseInt(valoare),ID));
        } else if (tip === 'ven'){
            data.iteme.ven.push(new Venit(descriere,parseInt(valoare),ID));
        }
    
        //Ultimul obiect
        
        var lastObject = data.iteme[tip][data.iteme[tip].length-1];
        
        addItem(lastObject,tip);
        
        //Calc operations

        calc(); 

    }

    document.querySelector('.descriere').value = '';
    document.querySelector('.valoare').value = '';

   
    
}

function merge(){
    console.log('merge')
}
//Adauga iteme in DOM

function addItem(obj,tip){

    var html,locatia;

    if(tip === 'ven'){
        html = '<div class="item" id="venit-%id%"><div class="descriere" id="des">%descriere% </div><div class="valoare-stergere"><div class="valoare-item"> %valoare% </div><span class="iconify del" data-icon="ion-ios-close-circle-outline" data-inline="false" id="delete-btn"></span></div></div>';


        locatia = document.querySelector('.lista-venituri');


    }else if(tip === 'che'){

        html = '<div class="item" id="cheltuiala-%id%"><div class="descriere" id="des"> %descriere% </div><div class="valoare-stergere"> <div class="valoare-item">%valoare%<span class="procent-cheltuiala">-</span></div><div class="iconify del" data-icon="ion-ios-close-circle-outline" data-inline="false" id="delete-btn"></div></div></div>';

        locatia = document.querySelector('.lista-cheltuieli');

    }

    var newHtml = html.replace('%id%',obj.id);
    newHtml = newHtml.replace('%valoare%',obj.valoare);
    newHtml = newHtml.replace('%descriere%',obj.descriere);
    

    
    

     locatia.insertAdjacentHTML('beforeend',newHtml)
}


function calcVenituri (){
    var venituri = data.iteme.ven;
    var sum = 0;
    for(var i = 0; i < venituri.length; i++){
        sum += venituri[i].valoare
    }

    return data.total.venituri = sum;
}

function calcCheltuieli(){
    var cheltuieli = data.iteme.che;
    var sum = 0;
    for(var i = 0; i < cheltuieli.length; i++){
        sum += cheltuieli[i].valoare
    }
    
    return data.total.cheltuieli = sum;
}

function calcBuget(){
    var buget = data.total.venituri - data.total.cheltuieli;
    
    return data.buget = buget;
}


function calcProcent(){
    
    return  data.procent = ((data.total.cheltuieli / data.total.venituri)*100).toFixed(2);
}



//Show buget in DOM

function showBuget(){
    

    cheltuieli. textContent = data.total.cheltuieli;
    bugetTotal.textContent=  data.buget;
    venituriTotale.textContent = data.total.venituri;

    if(data.total.venituri === 0){
        procentCheltuieli.textContent = '- ' + '%';

    }else{
        procentCheltuieli.textContent = data.procent + '%';

    }

}

function calc(){
    //Calc venituri totale
    calcVenituri();
    //Calc cheltuieli totale
    calcCheltuieli();
    //Buget 
    calcBuget();
    //Procent
    calcProcent();
    //Change dom
    showBuget();
    //Procent Element
    procentElement();
    //Afiseaza procentele
    procente();
}

function resetInput(){
    descriere.value = '';
    valoare.value = '';
}

function procente(){
    var matriceChe = data.iteme.che;
    var procentCheltuialDom =Array.from(document.querySelectorAll('.procent-cheltuiala'));

    matriceChe.forEach(function(el,index){
        procentCheltuialDom[el.id].textContent = el.procent + '%'
     });
    
}

function procentElement(){
    data.iteme.che.forEach(el =>{
        el.calcPro();
    })
}

