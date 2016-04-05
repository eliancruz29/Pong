var padding = 20;
var paddingInit = 200;
var velocity = 600;

var HelloWorldLayer = cc.Layer.extend({
    jugador1:null,    
    jugador2:null,    
    pelota:null,    
    puntuacion1:null,
    puntuacion2:null,
    sizeW:null,
    cuadro: null,
    inicializar:function(){
        var size = cc.winSize;
        this.sizeW = size;
        this.cuadro = {
            left: 0+padding,
            right: this.sizeW.width-padding,
            top: this.sizeW.height,
            bottom: 0
        }
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
                    height = this.cuadro.top;
                action = cc.moveTo(5, cc.p(0, height));
            }else{
                var height = 0;
                if(this.random(0, 1))
                    height = this.cuadro.top;
                action = cc.moveTo(5, cc.p(this.cuadro.right, height));
            }
        }else{
            var height = 0, width = 0;
            if(this.random(0, 1))
                height = this.cuadro.top;
            if(this.random(0, 1))
                width = this.cuadro.right;
            action = cc.moveTo(5, cc.p(width, height));
        }
        this.pelota.runAction(action);
    },
    
    verifyCollisionPelota: function(){
        console.log("Tamo aki");
    },
        
    calculeVelocity: function(distance){
        distance = Math.abs(distance);
        return distance/velocity;
    },
    
    moveLimites: function(keyCode, event){
        var juego = event.getCurrentTarget();
        var top = juego.cuadro.top;
        var bottom = juego.cuadro.bottom;
        switch (keyCode){
        case 38:
                var distance = top - juego.jugador1.getPositionY() - 100;
                if(!juego.jugador1.getActionByTag(101)){
                    var action = cc.moveTo(juego.calculeVelocity(distance), cc.p(juego.jugador1.getPositionX(), (top-100)));
                    action.setTag(101);
                    juego.jugador1.runAction(action);
                }
            break;
        case 40:
                var distance = juego.jugador1.getPositionY() - bottom + 100;
                if(!juego.jugador1.getActionByTag(101)){
                    var action = cc.moveTo(juego.calculeVelocity(distance), cc.p(juego.jugador1.getPositionX(), 0));
                    action.setTag(101);
                    juego.jugador1.runAction(action);
                }
            break;
        case 65:
                var distance = top - juego.jugador2.getPositionY() - 100;
                if(!juego.jugador2.getActionByTag(102)){
                    var action = cc.moveTo(juego.calculeVelocity(distance), cc.p(juego.jugador2.getPositionX(), (top-100)));
                    action.setTag(102);
                    juego.jugador2.runAction(action);
                }
            break;
        case 90:
                var distance = juego.jugador2.getPositionY() - bottom + 100;
                if(!juego.jugador2.getActionByTag(102)){
                    var action = cc.moveTo(juego.calculeVelocity(distance), cc.p(juego.jugador2.getPositionX(), 0));
                    action.setTag(102);
                    juego.jugador2.runAction(action);
                }
            break;
        }
    },
    
    stopLimites: function(keyCode, event){
        var juego = event.getCurrentTarget();
        switch (keyCode){
        case 38:
        case 40:
                var jugador = juego.jugador1;
                jugador.stopActionByTag(101);
            break;
        case 65:
        case 90:
                var jugador = juego.jugador2;
                jugador.stopActionByTag(102);
            break;
        }
    },
    
    ctor:function () {
        this._super();
        this.inicializar();
        
        this.scheduleOnce(this.movePelota, 1);
        //this.schedule(this.verifyCollisionPelota, null, null, 1);
        
        //add a keyboard event listener to statusLabel
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.moveLimites,
            onKeyReleased: this.stopLimites
        }, this);
        
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

