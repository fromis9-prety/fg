import {Bodies, Body, Engine, Events, Render, Runner, World} from "matter-js";
import { FROMIS } from "./fromis";
import "./style.css";

const engine = Engine.create();
const render = Render.create({
  engine,
  element: document.body,
  options:{
    wireframes: false,
    background: "#F7F4C8",
    width: 620,
    height: 850,
  }
});

const world = engine.world;

const leftWall=Bodies.rectangle(15, 396, 30, 790, {
  isStatic: true,
  render:{ fillStyle: "#DCD0FF" }
});

const rightWall=Bodies.rectangle(605, 396, 30, 790, {
  isStatic: true,
  render:{ fillStyle: "#DCD0FF" }
});

const ground=Bodies.rectangle(310, 820, 620, 60, {
  isStatic: true,
  render:{ fillStyle: "#DCD0FF" }
});
const topLine = Bodies.rectangle(310, 150, 620, 2, {
  name: "topLine",
  isStatic: true,
  isSensor: true,
  render:{ fillStyle: "#DCD0FF" }
});
World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFromis = null;
let disableAction = false;
let interval = null;
let num_fromis=0;

function addFromis() {
  const index = Math.floor(Math.random() * 5);;
  const fromis = FROMIS[index];

  const body = Bodies.circle(300, 50, fromis.radius,{
    index: index,
    isSleeping: true,
    render: {
      sprite: { texture: `${fromis.name}.png`}
    },
    restitution: 0.3,
  });

  currentBody = body;
  currentFromis = fromis;

  World.add(world, body);

}

window.onkeydown = (event)=> {
  if (disableAction){
    return;
  }
  switch (event.code){
    case "KeyA":
      if (interval)
        return;
      interval = setInterval(() => {
        if (currentBody.position.x - currentFromis.radius > 30)
          Body.setPosition(currentBody,{
            x: currentBody.position.x - 1,
            y: currentBody.position.y,
          });
      }, 5);
      break;
    
    case "KeyD":
      if (interval)
        return;
      interval = setInterval(() => {
        if(currentBody.position.x + currentFromis.radius < 590)
          Body.setPosition(currentBody,{
            x: currentBody.position.x + 1,
            y: currentBody.position.y,
          });
        }, 5);
      break;
    
    case "KeyS":
      currentBody.isSleeping = false;
      disableAction = true;

      setTimeout(() => {
        addFromis();
        disableAction = false;
      }, 1000);
      
      break;
  
  }
}

window.onkeyup = (event)=> {
  switch (event.code){
    case "KeyA":
    case "KeyD":
      clearInterval(interval);
      interval = null;
  }
}
Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((collision) => {
    if (collision.bodyA.index === collision.bodyB.index) {
      const index = collision.bodyA.index;

      if (index === FROMIS.length - 1) {
        return;
      }
      World.remove(world, [collision.bodyA, collision.bodyB]);

      const newFromis = FROMIS[index + 1];

      const newBody = Bodies.circle(
        collision.collision.supports[0].x,
        collision.collision.supports[0].y,
        newFromis.radius,
        {
          render: {
            sprite: { texture: `${newFromis.name}.png` }
          },
          index: index + 1,
        }
      );

      World.add(world, newBody);

      if (newFromis === FROMIS[10]){
        num_fromis++;
      }
      if (num_fromis === 2){
        alert("이겼따!")
      }



      
   

    }

    


    if (
      !disableAction &&
      (collision.bodyA.name === "topLine" || collision.bodyB.name === "topLine")) {
      alert("Game over");
    }
  });
});

addFromis();
