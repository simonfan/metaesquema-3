const Matter = require('matter-js')
const Metaesquema = require('metaesquema-util')
const instruments = require('./instruments')

/**
 * Matter submodules
 */
const Engine = Matter.Engine
const Render = Matter.Render
const Runner = Matter.Runner
const Body = Matter.Body
const Bodies = Matter.Bodies
const World = Matter.World
const Mouse = Matter.Mouse
const MouseConstraint = Matter.MouseConstraint
const Events = Matter.Events
const Common = Matter.Common

const MatterCollision = require('matter-collision')
const MatterCollisionStyles = require('./lib/matter-collision-styles')

function setup(options) {
  const CANVAS_WIDTH = options.canvasWidth
  const CANVAS_HEIGHT = options.canvasHeight
  let canvas = options.canvas

  if (!canvas) {
    throw new Error('canvas is required')
  }
  
  if (!CANVAS_WIDTH) {
    throw new Error('CANVAS_WIDTH is required')
  }
  
  if (!CANVAS_HEIGHT) {
    throw new Error('CANVAS_HEIGHT is required')
  }

  if (options.plugins) {
  	options.plugins.forEach(plugin => {
  		Matter.use(plugin)
  	})
  }

  // create engine
  let engine = Engine.create({
  	// enable sleeping as we are collision heavy users
  	// enableSleeping: true
  })

  engine.world.gravity.x = 0
  engine.world.gravity.y = 0

  // create renderer
  let render = Render.create({
  	canvas: canvas,
  	engine: engine,
  	options: {
  		wireframes: false,
      // showPositions: true,
      // showAngleIndicator: true,
  		background: '#1B108F',
  		pixelRatio: 1,

  		width: CANVAS_WIDTH,
  		height: CANVAS_HEIGHT,
  	}
  })
  Render.run(render)

  // create engine runner
  let runner = Metaesquema.Matter.Runner.createMixedRunner(engine)
  runner.run()

  let wallGenerator = Metaesquema.Matter.Bodies.walls({
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
  })

  let walls = [
    wallGenerator.top({
      label: 'CEILING',
      restitution: 1,
      plugin: {
        sound: {
          bodyName: 'CEILING'
        }
      }
    }),

    wallGenerator.bottom({
      label: 'GROUND',
      restitution: 1,
      friction: 0,
      frictionStatic: 0,
      plugin: {
        sound: {
          bodyName: 'GROUND',
        }
      }
    }),

    wallGenerator.left({
      label: 'LEFT',
      isStatic: true,
      restitution: 1,
      plugin: {
        sound: {
          bodyName: 'LEFT',
        }
      }
    }),

    wallGenerator.right({
      label: 'RIGHT',
      isStatic: true,
      restitution: 1,
      plugin: {
        sound: {
          bodyName: 'RIGHT',
        }
      }
    }),
	]

  World.add(engine.world, walls)

  /**
   * Rotating elements
   * @type {[type]}
   */
  let rotatingRectangles = [
    Bodies.rectangle(
      CANVAS_WIDTH / 3,
      CANVAS_HEIGHT / 2,         
      CANVAS_HEIGHT / 3,
      40,
      {
        isStatic: true,
        restitution: 1,
        plugin: {
          collision: {
            start: (collision) => {
              if (collision.other.isSensor) {
                instruments.conga.triggerAttack('G3')
              }
            }
          }
        },
        render: {
          fillStyle: '#711619',
        },
      }
    ),
    Bodies.rectangle(
      CANVAS_WIDTH * 2/3,
      CANVAS_HEIGHT / 2,         
      CANVAS_HEIGHT / 3,
      40,
      {
        isStatic: true,
        restitution: 1,
        plugin: {
          collision: {
            start: (collision) => {
              if (collision.other.isSensor) {
                instruments.conga.triggerAttack('G4')
              }
            }
          }
        },
        render: {
          fillStyle: '#711619',
        },
      }
    )
  ]
  World.add(engine.world, rotatingRectangles)

  // add rotation
  Events.on(engine, 'beforeUpdate', (event) => {
    Body.rotate(rotatingRectangles[0], 0.06)
    Body.rotate(rotatingRectangles[1], -0.03)
  })

  /**
   * Sensors
   * @type {[type]}
   */
  let sensors = [
    Bodies.rectangle(CANVAS_WIDTH / 3, CANVAS_HEIGHT * 1.25 / 2, 10, 10, {
      isSensor: true,
      isStatic: false,
      render: {
        fillStyle: 'transparent',
        lineWidth: 1,
        strokeStyle: '#FFFFFF'
      },
    }),
    Bodies.rectangle(CANVAS_WIDTH * 2 / 3, CANVAS_HEIGHT * 1.25 / 2, 10, 10, {
      isSensor: true,
      isStatic: false,
      render: {
        fillStyle: 'transparent',
        lineWidth: 1,
        strokeStyle: '#FFFFFF'
      },
    }),
    Bodies.rectangle(100, 400, 10, 10, {
      isSensor: true,
      isStatic: false,
      render: {
        fillStyle: 'transparent',
        lineWidth: 1,
        strokeStyle: '#FFFFFF'
      },
    }),
    Bodies.rectangle(100, 400, 10, 10, {
      isSensor: true,
      isStatic: false,
      render: {
        fillStyle: 'transparent',
        lineWidth: 1,
        strokeStyle: '#FFFFFF'
      },
    }),
    Bodies.rectangle(100, 400, 10, 10, {
      isSensor: true,
      isStatic: false,
      render: {
        strokeStyle: '#FFFFFF',
        fillStyle: 'transparent',
        lineWidth: 1,
      },
    }),
    Bodies.rectangle(100, 400, 10, 10, {
      isSensor: true,
      isStatic: false,
      render: {
        strokeStyle: '#FFFFFF',
        fillStyle: 'transparent',
        lineWidth: 1,
      },
    }),
  ]
  World.add(engine.world, sensors)

  let soundBodies = [
    Bodies.circle(600, 250, 20, {
      restitution: 1,
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0,
      slop: 0,
      density: 100,
      // inertia: Infinity,
      render: {
        fillStyle: '#041C3A',
      },
      plugin: {
        collision: {
          start: (e) => {
            let notes = [
              'C2',
              'F2',
              'G5',
            ]

            let note = notes[Math.floor(Math.random()*notes.length)];

            switch (e.other.label) {
              case 'CEILING':
                instruments.chords[0].triggerAttack(note)

                break
              case 'GROUND':
                instruments.chords[1].triggerAttack(note)

                break
              case 'LEFT':
                instruments.chords[2].triggerAttack(note)

                break
              case 'RIGHT':
                instruments.chords[3].triggerAttack(note)

                break
              default:
                // instruments.chords[0].triggerAttack('C4')
                break
            }
          }
        },
      },
    }),

    Bodies.circle(600, 250, 20, {
      restitution: 1,
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0,
      slop: 0,
      density: 0.0001,
      // inertia: Infinity,
      render: {
        fillStyle: '#D5D6D8',
      },
      plugin: {
        collision: {
          start: (collision) => {
            let notes = [
              'C4',
              'G4',
              'E4',
            ]

            let note = notes[Math.floor(Math.random()*notes.length)];

            switch (collision.other.label) {
              case 'CEILING':
                instruments.chords[0].triggerAttack(note)

                break
              case 'GROUND':
                instruments.chords[1].triggerAttack(note)

                break
              case 'LEFT':
                instruments.chords[2].triggerAttack(note)

                break
              case 'RIGHT':
                instruments.chords[3].triggerAttack(note)

                break
              default:
                // instruments.chords[0].triggerAttack('C4')
                break
            }
          },
        },
      }
    }),

  ]

  World.add(engine.world, soundBodies)


  // add mouse control
  let mouse = Mouse.create(render.canvas)
  let mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      // allow bodies on mouse to rotate
      angularStiffness: 0,
      render: {
        visible: false
      }
    }
  })

  World.add(engine.world, mouseConstraint);

  // keep the mouse in sync with rendering
  render.mouse = mouse;

  return {
  	engine: engine,
  	stop: () => {
	    Matter.Render.stop(render)
	    Matter.Runner.stop(runner)
  	}
  }
}


let config = {
  canvasWidth: window.innerWidth,
  canvasHeight: window.innerHeight,
  canvas: document.querySelector('canvas'),
  plugins: [
  	new MatterCollisionStyles(),
    Metaesquema.Matter.Plugins.maxVelocity({
      maxVelocity: 10,
    }),
    new MatterCollision({
      collisionMomentumUpperThreshold: 1000,
    })
  ]
}

let app = setup(config)

let mousePositionElement = document.querySelector('#mouse-position')
document.querySelector('body').addEventListener('mousemove', e => {
  mousePositionElement.innerHTML = `${e.clientX}x${e.clientY}`
})
