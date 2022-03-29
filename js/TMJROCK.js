//TMJROCK Library Part Starts
function $$$(componentId)
{
let element=document.getElementById(componentId);
if(!element) throw "Invalid Component ID : \""+componentId+"\"";
return new TMJRockElement(element);
}
function TMJRockElement(element)
{
this.element=element;
this.html=function(content){
if((typeof this.element.innerHTML)=='string')
{
if((typeof content)=='string')
{
this.element.innerHTML=content;
}
return this.element.innerHTML;
}
return null;
}
this.value=function(value){
if((typeof this.element.value)=='string')
{
if((typeof value)=='string')
{
this.element.value=value;
}
return this.element.value;
}
return null;
}
}
$$$.model={
"onStartup" : [],
"accordians" : [],
"modals" : []
}
$$$.toAccordian=function(componentReference)
{
let panels=[];
let componentChildrens=componentReference.childNodes;
for(let i=0;i<componentChildrens.length;i++)
{
if(componentChildrens[i].nodeName=='H3') panels[panels.length]=componentChildrens[i];
if(componentChildrens[i].nodeName=='DIV') panels[panels.length]=componentChildrens[i];
}
if(panels.length%2!=0) throw "Heading and Division Malformed in call to toAccordian";
for(let i=0;i<panels.length;i+=2)
{
if(panels[i].nodeName!='H3') throw "Heading and Division malformed in call to toAccordian";
if(panels[i+1].nodeName!='DIV') throw "Heading and Division malformed in call to toAccordian";
}
let accordianIndex=$$$.model.accordians.length;
function expandAccordian(panelIndex,accordianIndex)
{
let expandedIndex=$$$.model.accordians[accordianIndex].expandedIndex;
let panels=$$$.model.accordians[accordianIndex].panels;
if(expandedIndex!=-1) panels[expandedIndex].style.display='none';
panels[panelIndex+1].style.display=panels[panelIndex+1].oldDisplay;
$$$.model.accordians[accordianIndex].expandedIndex=panelIndex+1;
}
function accordianClickHandler(panelIndex,accordianIndex)
{
return function(){
expandAccordian(panelIndex,accordianIndex);
};
}
for(let i=0;i<panels.length;i+=2)
{
panels[i].style.cursor='pointer';
panels[i].onclick=accordianClickHandler(i,accordianIndex);
panels[i+1].oldDisplay=panels[i+1].style.display;
panels[i+1].style.display='none';
}
$$$.model.accordians[$$$.model.accordians.length]={
"panels" : panels,
"expandedIndex" : -1
};
}
function Modal(componentId)
{
this.componentId=componentId;
let componentReference=document.getElementById(componentId);
if(!componentReference) throw "Invalid Component ID : \""+componentId+"\"";
this.afterOpening=null;
this.beforeOpening=null;
this.afterClosing=null;
this.beforeClosing=null;
let self=this;
let modalMask=document.createElement("div");
let modal=document.createElement("div");
let closeModal=null;
componentReference.style.display='block';
componentReference.remove();
componentReference.setAttribute("modal",false);
let headerDivision=document.createElement("div");
let contentDivision=document.createElement("div");
let footerDivision=document.createElement("div");

headerDivision.style.height='40px';
headerDivision.style.right=0;
headerDivision.style.left=0;
headerDivision.style.padding='5px';
headerDivision.style.background='#8833ff';

footerDivision.style.height='40px';
footerDivision.style.right=0;
footerDivision.style.left=0;
footerDivision.style.padding='5px';
footerDivision.style.bottom=0;
footerDivision.style.position='absolute';
footerDivision.style.background='#6866dd';

contentDivision.style.right=0;
contentDivision.style.left=0;
contentDivision.style.padding='5px';
contentDivision.style.overflow='auto';
contentDivision.appendChild(componentReference);
modalMask.classList.add('modalMask');
modal.classList.add('modal');

if(componentReference.hasAttribute("size"))
{
let size=componentReference.getAttribute("size");
let xpos=size.indexOf('x');
if(xpos==-1) xpos=size.indexOf('X');
if(xpos==-1 || xpos==0 || xpos==size.length-1) throw "In case of modal size should be 'widthxheight'";
let width=size.substring(0,xpos);
let height=size.substring(xpos+1);
modal.style.width=width+'px';
modal.style.height=eval(parseInt(height)+80)+'px';
}
else
{
modal.style.width='400px';
modal.style.height='300px';
}
contentDivision.style.height=modal.style.height.substring(0,modal.style.height.length-2)-110+'px';
if(componentReference.hasAttribute("maskColor"))
{
let maskColor=componentReference.getAttribute("maskColor");
modalMask.style.background=maskColor;
}
if(componentReference.hasAttribute("modalColor"))
{
let modalColor=componentReference.getAttribute("modalColor");
contentDivision.style.background=modalColor;
}
if(componentReference.hasAttribute("header"))
{
let header=componentReference.getAttribute("header");
headerDivision.innerHTML=header;
}
if(componentReference.hasAttribute("footer"))
{
let footer=componentReference.getAttribute("footer");
footerDivision.innerHTML=footer;
}
if(componentReference.hasAttribute("closeButton"))
{
let closeButton=componentReference.getAttribute("closeButton").toUpperCase();
if(closeButton=='TRUE')
{
closeModal=document.createElement("span");
closeModal.classList.add('closeModal');
let closeModalMarker=document.createTextNode("x");
closeModal.appendChild(closeModalMarker);
headerDivision.appendChild(closeModal);
}
}
if(componentReference.hasAttribute("beforeOpening"))
{
let beforeOpening=componentReference.getAttribute("beforeOpening");
this.beforeOpening=beforeOpening;
}
if(componentReference.hasAttribute("afterOpening"))
{
let afterOpening=componentReference.getAttribute("afterOpening");
this.afterOpening=afterOpening;
}
if(componentReference.hasAttribute("beforeClosing"))
{
let beforeClosing=componentReference.getAttribute("beforeClosing");
this.beforeClosing=beforeClosing;
}
if(componentReference.hasAttribute("afterClosing"))
{
let afterClosing=componentReference.getAttribute("afterClosing");
this.afterClosing=afterClosing;
}

modal.appendChild(headerDivision);
modal.appendChild(contentDivision);
modal.appendChild(footerDivision);
modalMask.style.display='none';
modal.style.display='none';
document.body.appendChild(modalMask);
document.body.appendChild(modal);


this.show=function(){
let showModal=true;
if(this.beforeOpening) showModal=eval(this.beforeOpening);
if(showModal)
{
modalMask.style.display='block';
modal.style.display='block';
if(this.afterOpening) setTimeout(function(){eval(self.afterOpening);},100);
}
}
if(closeModal!=null)
{
closeModal.onclick=function(){
let removeModal=true;
if(self.beforeClosing) removeModal=eval(self.beforeClosing);
if(removeModal)
{
modalMask.style.display='none';
modal.style.display='none';
if(self.afterClosing) setTimeout(function(){eval(self.afterClosing);},100);
}
}
}
}
$$$.getModal=function(componentId){
for(let i=0;i<$$$.model.modals.length;i++)
{
if($$$.model.modals[i].componentId==componentId) return $$$.model.modals[i];
}
throw "Invalid Component ID : \""+componentId+"\"";
}
$$$.initFramework=function(){
let docs=document.getElementsByTagName("*");
for(var i=0;i<docs.length;i++)
{
if(docs[i].hasAttribute("accordian"))
{
if(docs[i].getAttribute("accordian")=='true')
{
$$$.toAccordian(docs[i]);
}
}
}
let modal=null;
for(var i=0;i<docs.length;i++)
{
if(docs[i].hasAttribute("modal"))
{
if(docs[i].getAttribute("modal")=='true')
{
modal=new Modal(docs[i].id);
$$$.model.modals[$$$.model.modals.length]=modal;
i--;
}
}
}
for(var i=0;i<$$$.model.onStartup.length;i++) $$$.model.onStartup[i]();
}
$$$.onDocumentLoaded=function(func){
$$$.model.onStartup[$$$.model.onStartup.length]=func;
}
window.addEventListener("load",function(){
$$$.initFramework();
});
//TMJROCK Library Part Ends