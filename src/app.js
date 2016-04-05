var padding = 20;
var velocity = 1000;

var HelloWorldLayer = cc.Layer.extend({
    jugador1:null,    
    jugador2:null,    
    pelota:null,    
    puntuacion1:null,
    puntuacion2:null,
    directionX: 1,
    directionY: 1,
    speedBall: 1,
    speedBallLimit: 3.0,
    moveX: null,
    moveY: null,
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
        this.jugador1.width = 20;
        this.jugador1.height = 100;
        this.jugador1.setPosition(size.width * 0.1,size.height / 2);
        this.addChild(this.jugador1, 1);

        this.jugador2 =  new cc.DrawNode();
        this.jugador2.drawRect(cc.p(0,0),cc.p(20,100),color,3);
        this.jugador2.width = 20;
        this.jugador2.height = 100;
        this.jugador2.setPosition(size.width -(size.width * 0.1),size.height / 2);
        this.addChild(this.jugador2, 1);        

        var lineaDivisoria =  new cc.DrawNode();
        lineaDivisoria.drawSegment(cc.p(size.width/2,0),cc.p(size.width/2,size.height),3,color);
        this.addChild(lineaDivisoria,0);
        
        this.pelota =  new cc.DrawNode();
        this.pelota.drawCircle(cc.p(0,0),5,0,100,false,10,color);
        this.pelota.width = this.pelota.height =  10;        
        this.pelota.setPosition(size.width / 2,size.height / 2);
        this.addChild(this.pelota, 1);

        this.puntuacion1 = new cc.LabelTTF("0","Arial",24);
        this.puntuacion1.setPosition(size.width * 0.4, size.height - (size.height * 0.10));
        this.addChild(this.puntuacion1,0);
        
        this.puntuacion2 = new cc.LabelTTF("0","Arial",24);
        this.puntuacion2.setPosition(size.width - (size.width * 0.4), size.height - (size.height * 0.10));
        this.addChild(this.puntuacion2,0);
        
        this.moveX = this.random(1, 4);
        this.moveY = this.random(1, 4);
        if(this.random(0, 1))
            this.directionX = -1;
        if(this.random(0, 1))
            this.directionY = -1;
    },
    
    random: function(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    movePelota: function(){
        var action = cc.moveBy(0.05, cc.p((this.moveX*this.directionX*this.speedBall), (this.moveY*this.directionY*this.speedBall)));
        this.pelota.runAction(action);
    },
    
    rectContainsRect: function(rect1, rect2){
        if(!rect1 || !rect2)
            return false;
        if(
            ((rect1.y)<=(rect2.y-rect2.height))&&
            ((rect1.y+rect1.height)>=(rect2.y+rect2.height))
        )
            return true;
            
        return false;
    },
    
    verifyCollisionPelota: function(){
        var position = this.pelota.getPosition();
        if(position.y >= this.cuadro.top-10){
            this.directionY = -1;
        }else if(position.y <= 10){
            this.directionY = 1;
        }
        
        var pelotaBox = this.pelota.getBoundingBox();
        var jugador1Box = this.jugador1.getBoundingBox();
        var jugador2Box = this.jugador2.getBoundingBox();
        var accurance = this.speedBall*this.speedBallLimit;
          
        /*if(cc.rectContainsRect(jugador2Box, pelotaBox)){
            this.directionX = -1;
            if(this.speedBall < this.speedBallLimit){
                this.speedBall += 0.05;
            }
        }else if(cc.rectContainsRect(jugador1Box, pelotaBox)){
            this.directionX = 1;
            if(this.speedBall < this.speedBallLimit){
                this.speedBall += 0.05;
            }
        }*/
        
        if((position.x+this.pelota.width) >= (this.jugador2.getPositionX()-(accurance))&&
          (position.x+this.pelota.width) < this.jugador2.getPositionX()){
            if(this.rectContainsRect(jugador2Box, pelotaBox)){
                this.directionX = -1;
                if(this.speedBall < this.speedBallLimit){
                    this.speedBall += 0.05;
                }
            }
        }else if((position.x-this.pelota.width) <= ((this.jugador1.getPositionX()+this.jugador1.width)+accurance)&&
                 (position.x-this.pelota.width) > (this.jugador1.getPositionX()+this.jugador1.width)){
            if(this.rectContainsRect(jugador1Box, pelotaBox)){
                this.directionX = 1;
                if(this.speedBall < this.speedBallLimit){
                    this.speedBall += 0.05;
                }
            }
        }
        
        if(position.x >= this.cuadro.right-10){
            this.directionX = -1;
        }else if(position.x <= 10){
            this.directionX = 1;
        }
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
        case 65:
                var distance = top - juego.jugador1.getPositionY() - 100;
                if(!juego.jugador1.getActionByTag(101)){
                    var action = cc.moveTo(juego.calculeVelocity(distance), cc.p(juego.jugador1.getPositionX(), (top-100)));
                    action.setTag(101);
                    juego.jugador1.runAction(action);
                }
            break;
        case 90:
                var distance = juego.jugador1.getPositionY() - bottom + 100;
                if(!juego.jugador1.getActionByTag(101)){
                    var action = cc.moveTo(juego.calculeVelocity(distance), cc.p(juego.jugador1.getPositionX(), 0));
                    action.setTag(101);
                    juego.jugador1.runAction(action);
                }
            break;
        case 38:
                var distance = top - juego.jugador2.getPositionY() - 100;
                if(!juego.jugador2.getActionByTag(102)){
                    var action = cc.moveTo(juego.calculeVelocity(distance), cc.p(juego.jugador2.getPositionX(), (top-100)));
                    action.setTag(102);
                    juego.jugador2.runAction(action);
                }
            break;
        case 40:
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
        case 65:
        case 90:
                var jugador = juego.jugador1;
                jugador.stopAllActions();
            break;
        case 38:
        case 40:
                var jugador = juego.jugador2;
                jugador.stopAllActions();
            break;
        }
    },
    
    ctor:function () {
        this._super();
        this.inicializar();
        
        this.schedule(this.movePelota, null, null, 1);
        this.schedule(this.verifyCollisionPelota, null, null, 1);
        
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