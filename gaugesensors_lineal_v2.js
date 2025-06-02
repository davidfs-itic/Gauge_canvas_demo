/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


 function  DashboardGaugeLinear2(canvasid) {
      this.debug=0;
      this.canvas= document.getElementById(canvasid);
      this.ctx=this.canvas.getContext('2d');
      this.marginheader=30;
      //this.marginlabel=50;
      
      this.gaugewidth=this.canvas.width;//-this.marginlabel;
      this.gaugeheight=(this.canvas.height-this.marginheader);
      
      this.tickmarkheightpercent=0.5;
      this.tickmarkwidthpercent=0.025;
      this.tickmarkstartpercent=0.15;
      this.tickmarkstoppercent=0.70;
      this.tickmarkdeltapercent=0.04;
      
      this.tickmarkheight=this.gaugeheight*this.tickmarkheightpercent;
      this.tickmarkwidth=this.gaugewidth*this.tickmarkwidthpercent;
      this.tickmarkstart=this.gaugewidth*this.tickmarkstartpercent;
      this.tickmarkstop=this.gaugewidth*this.tickmarkstoppercent;
      this.tickmarkdelta=this.gaugewidth*this.tickmarkdeltapercent;
      this.ValueMin=20;
      this.ValueMax=40;
      this.Value=30;
      this.ValueText="30";
      this.LowThereshold=27;
      this.HighThereshold=35;
      this.LowTheresholdcolor='#5a84e8';
      this.CorrectTheresholdcolor='#23ee09';
      this.HighTheresholdColor='#edaa59';
      this.Title="Temperatura";
      this.TitleColor="#e1392c"; //"#e15d53";
     
      this.imgarraysrc=["./media/boto_enfonsat.svg"
          ,"./media/led_low_on.svg","./media/led_low_off.svg"
          ,"./media/led_normal_on.svg","./media/led_normal_off.svg"
          ,"./media/led_high_on.svg","./media/led_high_off.svg"
      ];
      this.imgarrayobj=[];
      this.imgarrayobj.length=7;
      this.numimagesloaded=0;
      this.actualpaint=null;
      this.DecimalFormat=1;
      
  };
  
DashboardGaugeLinear2.prototype = {
    constructor: DashboardGaugeLinear2,
    valuetopos:function(val){
        var difvalues=this.ValueMax-this.ValueMin;
        var difpos=this.tickmarkstop-this.tickmarkstart;
        var percentvalue=(val-this.ValueMin)/difvalues;
        var deltapos=difpos*percentvalue;
        return this.tickmarkstart+deltapos;    
    }, colorwithaplha:function(color,alpha){
        //El color d'entrada es de l'estil #RRGGBB
        var strcolor= color.substring(1);
        var intcolor=parseInt(strcolor, 16);
        var blue = (intcolor & 0xFF);
        var green = ((intcolor >> 8) & 0xFF);
        var red = ((intcolor >> 16) & 0xFF);
        strcolor = "rgba("+red.toString()+","+green.toString()+","+blue.toString()+","+alpha+")";
        return strcolor;
    },
    tintcolor:function(color,tint_factor){
        var strcolor= color.substring(1);
        var intcolor=parseInt(strcolor, 16);
        var blue = (intcolor & 0xFF);
        var green = ((intcolor >> 8) & 0xFF);
        var red = ((intcolor >> 16) & 0xFF);
        blue = Math.round(blue + ((255 - blue) * tint_factor));
        green = Math.round(green + ((255 - green) * tint_factor*3));
        red = Math.round(red + ((255 - red) * tint_factor));
        if (blue>255){blue=255;}
        if (blue<0){blue=0;}
        if (green>255){green=255;}
        if (green<0){green=0;}
        if (red>255){red=255;}
        if (red<0){red=0;}        
        strcolor = "rgb("+red.toString()+","+green.toString()+","+blue.toString()+")";  
        return strcolor;
    },
    preloadimg:function(){
        for (var i = 0; i < this.imgarraysrc.length; i++) {
            
            var img = new Image();
            //binding. 1st arg=this inside function, 2,..n arg.= parameter list.
            img.onload=this.imgloaded.bind(img,this,i); this.imgloaded;
            img.src=this.imgarraysrc[i];
        }
    },
    imgloaded:function(gaugeobj,index){
        //this=img
        this.onload=null;
        gaugeobj.imgarrayobj[index]= this;
        gaugeobj.numimagesloaded=gaugeobj.numimagesloaded+1;
        if ( gaugeobj.numimagesloaded===gaugeobj.imgarrayobj.length){
           //this.actualpaint();
           gaugeobj.doPaint();
        }        
    },
    paint:function (){
            //this.actualpaint=function (){this.dopaint()};
            this.preloadimg();   
     },  
    doPaint:function(){
            
            this.ctx.save();
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            
            this.paintBackground(this.ctx);
            
            this.painttickmarks(this.ctx);

            this.paintlabel(this.ctx); 
            if (this.Title!=""){
                            this.paintheader(this.ctx);
            }

    },
    paintBackground:function (ctx) {
        ctx.save();
        if ( this.debug != 0)
        {
            ctx.fillStyle="white";
            ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
            ctx.fillStyle="rgba(255,0,0,0.5)";
            ctx.fillRect(0,0,this.canvas.width,this.marginheader);
        }
        //ctx.fillStyle="rgba(0,0,255,0.5)";
        //ctx.fillRect(this.canvas.width-this.marginlabel,0,this.marginlabel,this.canvas.height); 
        this.gaugeheight=(this.canvas.height-this.marginheader);
        
        var propimage=this.imgarrayobj[0].width/this.imgarrayobj[0].height;
        
        if ((this.gaugewidth/this.gaugeheight)>propimage){
            //si la proporció del canvas es superior a la de la imatge, el canvas es mes alt, 
            //en proporcio a la imatge, i per tant
            //s'ha d'ajustar la amplada del dibuix
            this.gaugewidth=this.gaugeheight*propimage;
        }else{
            //el canvas es suficientment ample doncs aleshores ajustem l'alçada
            this.gaugeheight=this.gaugewidth/propimage;
        }
        
        
        ctx.drawImage(this.imgarrayobj[0], 0, (ctx.canvas.height-this.gaugeheight),this.gaugewidth,this.gaugeheight);   
        this.tickmarkheight=this.gaugeheight*this.tickmarkheightpercent;
        this.tickmarkwidth=this.gaugewidth*this.tickmarkwidthpercent;
        this.tickmarkstart=this.gaugewidth*this.tickmarkstartpercent;
        this.tickmarkstop=this.gaugewidth*this.tickmarkstoppercent;
        this.tickmarkdelta=this.gaugewidth*this.tickmarkdeltapercent;

        ctx.restore();
    },
    painttickmarks:function(ctx){
        ctx.save();
        ctx.translate(0,this.canvas.height-(this.gaugeheight/2));
        var pos=this.tickmarkstart;
        var imgindex=1;
        var img=this.imgarrayobj[1];
        while (pos<this.tickmarkstop){
            
            if (pos<this.valuetopos(this.LowThereshold)){
                imgindex=1;
            }else{
                if (pos>this.valuetopos(this.HighThereshold)){
                   imgindex=5; 
                }else{
                    imgindex=3;
                }
            }
             
            if (pos>this.valuetopos(this.Value)){
              imgindex=imgindex+1;  
            }
            
            ctx.drawImage(this.imgarrayobj[imgindex],pos,-this.tickmarkheight/2,this.tickmarkwidth,this.tickmarkheight);
            pos=pos+this.tickmarkdelta;
        }
        
        
        ctx.restore(); 
    },
    paintlabel:function (ctx) {
        
        
        ctx.save();

        ctx.textAlign="center";
        ctx.textBaseline="middle";

        //ctx.translate((this.canvas.width-(this.marginlabel/2)),this.canvas.height-(this.gaugeheight/2));
        
        var labelwidth=this.gaugewidth-(this.tickmarkstart/2) - this.tickmarkstop
                
        ctx.translate(this.tickmarkstop+(labelwidth/2),this.canvas.height-(this.gaugeheight/2));
        

        var txth=Math.round((this.gaugeheight/3));
        //ctx.font = txth.toString()+'px Source Code Pro';
        ctx.font = txth.toString()+'px Expletus Sans';
        //ctx.font = txth.toString()+'px Inconsolata';
        var color="#000000";
        if (this.Value<this.LowThereshold){
           color=this.LowTheresholdcolor;
        }else{
            if(this.Value>this.HighThereshold){
                color=this.HighTheresholdColor;
            }else{
                color=this.CorrectTheresholdcolor;
            }
        }
        if ( this.debug != 0)
        {
            ctx.fillStyle="rgba(0,128,125,0.5)";
            ctx.fillRect(-labelwidth/2,-this.tickmarkheight/2,labelwidth,this.tickmarkheight);   
        }
  
        this.textglowing(ctx,this.ValueText,color, 0,Math.round(txth/8),labelwidth,this.tickmarkheight);

        ctx.restore();
    },
    paintheader:function(ctx){
        ctx.save();
        ctx.textAlign="center";
        ctx.textBaseline="middle";
                
      
        var txth=Math.round(this.marginheader);
        ctx.font = txth.toString()+"px Roboto Condensed";
        /*var maxwidth=ctx.measureText(this.Title);
        while ((maxwidth.width>(this.outerRadius*2)) || (txth<8)){
            txth=txth-3;
            ctx.font = txth.toString()+'px Roboto Condensed';
            maxwidth=ctx.measureText(this.Title);
        }*/
        this.textglowing(ctx,this.Title,this.TitleColor,this.gaugewidth/2,this.marginheader/2,this.canvas.width*2,this.canvas.height*2);

        ctx.restore();
    },
    textglowing:function(ctx,text,color,x,y,cliprectwidth,cliprectheight){
        ctx.save();
        ctx.beginPath();
        ctx.rect(x-(cliprectwidth/2),y-(cliprectheight/2),cliprectwidth,cliprectheight);
        //ctx.stroke();
        ctx.clip();
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY =y+(cliprectheight);
        var steps=5;
        var maxblur=8;

        for (i=steps;i>0;i--){
            ctx.shadowColor=this.colorwithaplha(color,0.5);
            ctx.shadowBlur = Math.round(i*(maxblur/steps));
            ctx.beginPath();
            ctx.fillText(text,x,y-ctx.shadowOffsetY);
        }
        
        ctx.shadowBlur =2;        
        ctx.shadowColor=this.tintcolor(color,-4);
        ctx.fillText(text,x,y-ctx.shadowOffsetY);         
        //ctx.fillText(text,x,y-ctx.shadowOffsetY); 
        //ctx.fillText(text,x,y-ctx.shadowOffsetY); 

        
        ctx.fillStyle=this.tintcolor(color,-4);
        ctx.fillText(text,x,y-1);

        ctx.fillStyle=this.tintcolor(color,0.2);
        ctx.fillText(text,x,y);
        ctx.restore();        
        
    },
    UpdateValue:function(url){
        var xhttp = new XMLHttpRequest();
        /*xhttp.addEventListener("progress", updateProgress, false);
        xhttp.addEventListener("load", transferComplete, false);
        xhttp.addEventListener("error", transferFailed, false);
        xhttp.addEventListener("abort", transferCanceled, false);
        */
        xhttp.onerror=this.transferFailed.bind(xhttp,this);
        xhttp.onreadystatechange = this.getajaxrequest.bind(xhttp,this);
        xhttp.open("GET", url, true);
        xhttp.send();
    },
    getajaxrequest:function(gauge){
        if (this.readyState == 4 && this.status == 200) {
            try
            {
                var jsonarray=JSON.parse(this.responseText);
                gauge.Value=jsonarray.Value;
                gauge.ValueText= gauge.Value.toFixed(gauge.DecimalFormat);
                gauge.paint();
            }catch(err) {
                console.log("malformedjson:"+this.responseText);
                gauge.Value=gauge.ValueMin;
                gauge.ValueText="--";
                gauge.paint();
            }

        }
    } ,
    transferFailed:function(gauge){
         console.log(this.status);
         gauge.Value=gauge.ValueMin;
         gauge.ValueText="--";
         gauge.paint();
    } 
};

