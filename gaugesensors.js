/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

 function  DashboardGauge2(canvasid) {
      this.canvas= document.getElementById(canvasid);
      this.ctx=this.canvas.getContext('2d');
      this.outerRadius=(this.canvas.width/2.1)*0.9;
      this.crownwidth=(this.canvas.width/2.1)*0.10;
      this.tickmarkInset=(this.canvas.width/2.1)*0.15;
      this.xCenter=this.canvas.width/2.1;
      this.yCenter=50+this.canvas.width/2.1;
      this.TickmarkWidth = this.outerRadius/5;
      this.TickmarkHeight=this.outerRadius/22;
      this.anglestart=this.degToRad(-40);
      this.angleend=this.degToRad(220);
      this.angledelta=this.degToRad(8);     
      this.ValueMin=20;
      this.ValueMax=40;
      this.Value=37.5;
      this.ValueText="37.5";
      this.ValueFont="expeltus";
      this.LowThereshold=27;
      this.HighThereshold=37;
      this.LowTheresholdcolor='#5a84e8';
      this.CorrectTheresholdcolor='#23ee09';
      this.HighTheresholdColor='#edaa59';
      this.Title="Temperatura";
      this.TitleColor="#e1392c"; //"#e15d53";
      this.TitleFont="robotolight";
      this.ImageLegendSrc="";
      this.yOffsetlegend=this.outerRadius/5;
      this.DecimalFormat=1;
      this.Textureimage=undefined;
      this.Icon=undefined;
      this.urlchecked="";
  }
  
DashboardGauge2.prototype = {
    constructor: DashboardGauge2,  
    /*toPixels:function(percentage) {
        return percentage * outerRadius;
    },*/
    degToRad:function (degrees) {
        return degrees * (Math.PI / 180);
    },
    radToDeg:function (radians) {
        return radians * (180 / Math.PI);
    },
    valuetoangle:function(val){
        var difvalues=this.ValueMax-this.ValueMin;
        var difangles=this.angleend-this.anglestart;
        var percentvalue=(val-this.ValueMin)/difvalues;
        var deltaangle=difangles*percentvalue;
        return this.anglestart+deltaangle;
    },
    colorwithaplha:function(color,alpha){
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
    fillrectglow:function(x,y,width,height,angle){
        
       
        var color=this.ctx.fillStyle;
        var steps=10;
        var heighdelta=(height*1.4)/steps;
        var lightdelta=Math.round(200/steps);



        for (i=steps;i>0;i--)
        {
            if (i>(steps/2)){
                this.ctx.globalCompositeOperation="source-over";
                this.ctx.fillStyle=this.colorwithaplha(color,1-((i-1)/steps).toString());
                
            }else{
                this.ctx.globalCompositeOperation='lighter';
                this.ctx.fillStyle="rgb("+lightdelta.toString()+","+lightdelta.toString()+","+lightdelta.toString()+")";
            }
            
            this.ctx.fillRect(x,y-((i*heighdelta)/2),width,(i*heighdelta));
            
            
        }
        //Brillo final.
        this.ctx.globalCompositeOperation='source-over';
        this.ctx.fillStyle=this.tintcolor(color,1);
        this.ctx.fillRect(x,y-(heighdelta/2),width,heighdelta);


        //Reflex final
        //this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.outerRadius ,  0, Math.PI * 2,true);
        this.ctx.strokeStyle="red";
        this.ctx.lineWidth = 1;
        this.ctx.clip();

        
        this.ctx.beginPath();
       
        this.ctx.fillStyle=color;
        var xoffset=20;
        var shadowheight=height;
        var shadowwidth=15;//this.crownwidth-2;
        this.ctx.shadowColor=color;//this.tintcolor(color,1.5);
        
        var xangle=xoffset*Math.cos(angle)*0.5;
        var yangle=xoffset* Math.sin(angle)*0.5;
        //console.log("Ang:"+(Math.round(angle*100)/100).toString()+" x:"+Math.round(xangle).toString()+" y:"+Math.round(yangle).toString());
        
        this.ctx.shadowBlur = 20;
        this.ctx.shadowOffsetX=xangle;
        this.ctx.shadowOffsetY=yangle;
        this.ctx.beginPath();
        this.ctx.fillStyle="rgba(0,0,0,0,1)";
        this.ctx.fillRect(-this.outerRadius-xoffset,y-(shadowheight/2),shadowwidth,shadowheight);
        this.ctx.shadowBlur = this.ctx.shadowOffsetX=this.ctx.shadowOffsetY=0;
        //this.ctx.restore(); 

    },
    fillrectshadow:function(x,y,width,height,angle,radius){
        var ctx=this.ctx;
        

        //ctx.rotate(-angle);
        x=radius*Math.cos(angle);
        y=radius* Math.sin(angle);
        /*
        this.ctx.shadowBlur = 15;
        this.ctx.shadowOffsetX=0;
        this.ctx.shadowOffsetY=0;
        this.ctx.beginPath();
        */
        
        
        ctx.shadowOffsetX = ctx.shadowOffsetY = ctx.shadowBlur = 0;
        
    },      
    paintBackground:function (ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.xCenter,this.yCenter);
        
        var gradient_inset= ctx.createLinearGradient(0,-this.outerRadius, 0,this.outerRadius);
        gradient_inset.addColorStop(0.3, "black");   
        //gradient_inset.addColorStop(0.4, "rgb(100,100,100)"); 
        gradient_inset.addColorStop(0.7, "rgb(100,100,100)"); 
        gradient_inset.addColorStop(1, "rgb(128,128,128)");     
        //gradient_inset.addColorStop(0.6, "rgb(128,128,128)");
        var gradient_outset= ctx.createLinearGradient(0,-this.outerRadius, 0,+this.outerRadius);
        gradient_outset.addColorStop(0.1, "rgb(70,70,70)");
        gradient_outset.addColorStop(0.9, "rgb(40,40,40)");

        var gradient_light= ctx.createRadialGradient(0,-this.outerRadius, 0,0,0,this.outerRadius);
        gradient_light.addColorStop(0.1, "rgb(90,90,90)");
        gradient_light.addColorStop(0.9, "rgb(20,20,20)");

        var gradient_light_alpha= ctx.createRadialGradient(0,-this.outerRadius, 0,0,0,this.outerRadius);
        gradient_light_alpha.addColorStop(0.1, "rgba(90,90,90,0.3)");
        gradient_light_alpha.addColorStop(0.9, "rgba(20,20,20,0.3)");
        
        /*ctx.shadowColor = '#000000';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 15;*/
        ctx.fillStyle="rgb(128,128,128)";
        ctx.arc(0, 2, this.outerRadius+1 ,  0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle=gradient_inset;
        ctx.arc(0, 0, this.outerRadius ,  0, Math.PI * 2);
        ctx.fill();
        ctx.shadowOffsetX = ctx.shadowOffsetY = ctx.shadowBlur = 0;
        /*
        ctx.beginPath();
        ctx.shadowOffsetX = ctx.shadowOffsetY = ctx.shadowBlur = 0;
        ctx.fillStyle=gradient_light;        
        ctx.arc(0, 0,  this.outerRadius-(this.crownwidth),0, Math.PI * 2);
        ctx.fill();
         */
        var previuscomposite=ctx.globalCompositeOperation;
        if (!(this.Textureimage === undefined))
        {
            ctx.beginPath();
            ctx.fillStyle=gradient_light;        
            ctx.arc(0, 0,  this.outerRadius-(this.crownwidth),0, Math.PI * 2);
            ctx.fill();
            

            ctx.globalCompositeOperation = "soft-light";             
            ctx.beginPath();
            ctx.arc(0, 0, this.outerRadius ,  0, Math.PI * 2);
            ctx.clip();
            //ctx.drawImage(this.Textureimage,-this.Textureimage.width/2,-this.Textureimage.height/2);            
            ctx.drawImage(this.Textureimage,-this.canvas.width/2,-this.canvas.height/2,this.canvas.width,this.canvas.height);            
            
            ctx.globalCompositeOperation = "lighten"; 
            ctx.beginPath();
            ctx.fillStyle=gradient_light_alpha;        
            ctx.arc(0, 0,  this.outerRadius-(this.crownwidth),0, Math.PI * 2);
            ctx.fill();
            
        }else{
            ctx.beginPath();
            ctx.shadowOffsetX = ctx.shadowOffsetY = ctx.shadowBlur = 0;
            ctx.fillStyle=gradient_light;        
            ctx.arc(0, 0,  this.outerRadius-(this.crownwidth),0, Math.PI * 2);
            ctx.fill();   
        }
      
        ctx.globalCompositeOperation=previuscomposite;

        
        
        ctx.restore();        
    },
    painttickmarks:function (ctx) {  
        ctx.save();


        ctx.translate(this.xCenter,this.yCenter);
        var angle=this.anglestart;
        var anglevalue=this.valuetoangle(this.Value);
        
        this.ctx.beginPath();
        ctx.rotate(this.anglestart);
        var tickmarkcolor='#000000';
               
        
        while (angle<this.angleend){
            
     

            if (angle<this.valuetoangle(this.LowThereshold))
            {tickmarkcolor=this.LowTheresholdcolor;}
            else
            { if (angle<this.valuetoangle(this.HighThereshold))
                tickmarkcolor=this.CorrectTheresholdcolor;
                else{tickmarkcolor=this.HighTheresholdColor;}
            }
            
             if (angle<anglevalue){
                 //paint bright
                   //ctx.shadowBlur = 10;
                   //ctx.shadowColor = 'rgba(0,255,0,1)';
                   ctx.fillStyle = tickmarkcolor;
                   this.fillrectglow(-(this.outerRadius-this.tickmarkInset),-this.TickmarkHeight/2,this.TickmarkWidth,this.TickmarkHeight,angle);  
                   this.fillrectshadow(-this.outerRadius,-this.TickmarkHeight/2,this.TickmarkWidth,this.TickmarkHeight,angle,this.outerRadius)
             }else{
                 //paint 
                 //ctx.shadowBlur = 0; 
                 //ctx.shadowColor ="#00000000"
                 //ctx.fillStyle =  '#FF000010';
                 ctx.fillStyle = this.colorwithaplha(tickmarkcolor,"0.3");
                 ctx.fillRect(-(this.outerRadius-this.tickmarkInset),-this.TickmarkHeight/2,this.TickmarkWidth,this.TickmarkHeight);
             }

             angle=angle+this.angledelta;
             ctx.rotate(this.angledelta);
             
        }
        
        ctx.restore();          
    },
    paintlabel:function (ctx) {
        ctx.save();

        ctx.textAlign="center";
        ctx.textBaseline="middle";

        ctx.translate(this.xCenter,this.yCenter);
        
        var txth=Math.round((this.outerRadius/3)+10);
        //ctx.font = txth.toString()+'px Source Code Pro';
        ctx.font = txth.toString()+'px '+this.ValueFont;
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
     
        this.textglowing(ctx,this.ValueText,color, 0,0,this.outerRadius*3,this.outerRadius*2);
        
        ctx.restore();
    },
    paintheader:function(ctx){
        ctx.save();
        ctx.textAlign="center";
        ctx.textBaseline="top";
                
        var txth=Math.round((this.outerRadius/3)+5); 
        txth="30";
        ctx.font = txth.toString()+"px "+this.TitleFont;
       /* var maxwidth=ctx.measureText(this.Title);
        while ((maxwidth.width>(this.outerRadius*2)) || (txth<8)){
            txth=txth-3;
            ctx.font = txth.toString()+'px Roboto Condensed';
            maxwidth=ctx.measureText(this.Title);
        }*/
        this.textglowing(ctx,this.Title,this.TitleColor,this.xCenter,10,this.outerRadius*3,this.outerRadius*2);

        ctx.restore();
    },
    textglowing:function(ctx,text,color,x,y,cliprectwidth,cliprectheight){

        ctx.beginPath();
        ctx.rect(x-(cliprectwidth/2),y-(cliprectheight/2),cliprectwidth,cliprectheight);
        //ctx.stroke();
        ctx.clip();
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY =y+(cliprectheight*3);
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
    paintlegend:function(ctx){

        if (!(this.Icon === undefined))
        {
            ctx.save();
            ctx.translate(this.xCenter,this.yCenter+(this.outerRadius/2)); 
            /*
            console.log("draw icon");

            ctx.beginPath();
            ctx.strokeStyle="white";
            ctx.rect(-30,-30,60,60);
            ctx.stroke();
            */
            var hRatio = 50 / this.Icon.width    ;
            var vRatio = 50 / this.Icon.height  ;
            var ratio  = Math.min ( hRatio, vRatio );
            if (ratio>1){ratio=1;}
            var newwidth=this.Icon.width*ratio;
            var newheight=this.Icon.height*ratio;
            
            ctx.drawImage(this.Icon, -newwidth/2,-newheight/2,  newwidth, newheight);
            ctx.restore();
        }        
        
        

    },
    paint:function (){

            this.ctx.save();
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            //this.ctx.fillStyle="white";
            //this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);  
            this.paintheader(this.ctx);
            this.paintBackground(this.ctx);
            this.paintlegend(this.ctx);
            this.painttickmarks(this.ctx);

            this.paintlabel(this.ctx);
            
     } ,
    UpdateValue:function(url){
        var xhttp = new XMLHttpRequest();
        /*xhttp.addEventListener("progress", updateProgress, false);
        xhttp.addEventListener("load", transferComplete, false);
        xhttp.addEventListener("error", transferFailed, false);
        xhttp.addEventListener("abort", transferCanceled, false);
        */
        this.urlchecked=url;
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
                console.log("Error Request:"+this.responseText+" Url:"+gauge.urlchecked);
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
