
var HelloWorldLayer = cc.Layer.extend({
    jugador1:null,    
    jugador2:null,    
    pelota:null,    
    puntuacion1:null,
    puntuacion2:null,
    sizeW:null,
    inicializar:function(){
        var size = cc.winSize;
        this.sizeW = size;
        var color = cc.color(100,100,100);

        this.jugador1 =  new cc.DrawNode();
        this.jugador1.drawRect(cc.p(0,0),cc.p(20,100),color,3);
        this.jugador1.setPosition(size.width * 0.1,size.height / 2);
        this.addChild(this.jugador1, 1);

        this.jugador2 =  new cc.DrawNode();
        this.jugador2.drawRect(cc.p(0,0),cc.p(20,100),color,3);
        this.jugador2.setPosition(size.width -(size.width * 0.1),size.height / 2);
        this.addChild(this.jugador2, 1);        

        var lineaDivisoria =  new cc.DrawNode();
        lineaDivisoria.drawSegment(cc.p(size.width/2,0),cc.p(size.width/2,size.height),3,color);
        this.addChild(lineaDivisoria,0);
        
        this.pelota =  new cc.DrawNode();
        this.pelota.drawCircle(cc.p(0,0),5,0,100,false,10,color);
        this.pelota.setPosition(size.width / 2,size.height / 2);
        this.addChild(this.pelota, 1);

        this.puntuacion1 = new cc.LabelTTF("0","Arial",24);
        this.puntuacion1.setPosition(size.width * 0.4, size.height - (size.height * 0.10));
        this.addChild(this.puntuacion1,0);
        
        this.puntuacion2 = new cc.LabelTTF("0","Arial",24);
        this.puntuacion2.setPosition(size.width - (size.width * 0.4), size.height - (size.height * 0.10));
        this.addChild(this.puntuacion2,0);
    },
    
    random: function(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    movePelota: function(direction){
        
        var action;
        if(isNaN(direction)){
            if(direction.toLowerCase() == "left"){
                var height = 0;
                if(this.random(0, 1))
                    height = this.sizeW.height;
                action = cc.moveTo(5, cc.p(0, height));
            }else{
                var height = 0;
                if(this.random(0, 1))
                    height = this.sizeW.height;
                action = cc.moveTo(5, cc.p(this.sizeW.width, height));
            }
        }else{
            var height = 0, width = 0;
            if(this.random(0, 1))
                height = this.sizeW.height;
            if(this.random(0, 1))
                width = this.sizeW.width;
            action = cc.moveTo(5, cc.p(width, height));
        }
        this.pelota.runAction(action);
    },
    
    verifyCollisionPelota: function(){
        console.log("Tamo aki");
    },
    
    ctor:function () {
        this._super();
        this.inicializar();
        
        this.scheduleOnce(this.movePelota, 1);
        
        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

