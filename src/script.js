import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import * as dat from 'lil-gui'

/**
 * Base
 */

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('textures/matcaps/8.png')

// Material
const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
material.wireframe = false
material.matcap = matcapTexture

/**
 * 3D Text
 */
const textLoader = new FontLoader()
textLoader.load
(
    '/fonts/helvetiker_regular.typeface.json',
    //'/node_modules/three/examples/fonts/optimer_regular.typeface.json',
    (font) =>
    {
    // Text
    const textString = 'Donuts'
    const textGeometry = new TextGeometry (
        textString,
        {
            font: font,
            size: 5,
            height: 2,
            curveSegments: 8,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 4,
            bevelEnabled: true
        }
    )

    textGeometry.center()
    const text = new THREE.Mesh(textGeometry, material)


    // Parent textGeometry Instantiation for Redraw
    const textParent = new THREE.Object3D()
    textParent.add(text)
    scene.add(textParent)
    const options = textGeometry.parameters.options
    const textGeometryProperties = {
        font: options.font,
        size: options.size,
        height: options.height,
        curveSegments: options.curveSegments,
        bevelEnabled: options.bevelEnabled,
        bevelOffset: options.bevelOffset,
        bevelThickness: options.bevelThickness,
        bevelSize: options.bevelSize,
        bevelSegments: options.bevelSegments
    }

    // GUI for textGeometry
    const textPropertiesFolder = gui.addFolder('Text Properties')
    textPropertiesFolder
        .add(textGeometryProperties, 'size', 1, 30)
        .step(0.1)
        .onChange(redrawTextGeometry)
        .onFinishChange(() => console.dir(text.geometry))
    textPropertiesFolder
        .add(textGeometryProperties, 'height', 0, 30)
        .step(0.1)
        .onChange(redrawTextGeometry)
    textPropertiesFolder
        .add(textGeometryProperties, 'curveSegments', 1, 30)
        .step(1)
        .onChange(redrawTextGeometry)
    textPropertiesFolder
        .add(textGeometryProperties, 'bevelEnabled')
        .onChange(redrawTextGeometry)
    textPropertiesFolder
        .add(textGeometryProperties, 'bevelOffset', 0, 1)
        .onChange(redrawTextGeometry)
    textPropertiesFolder
        .add(textGeometryProperties, 'bevelThickness', 0, 3)
        .onChange(redrawTextGeometry)
    textPropertiesFolder
        .add(textGeometryProperties, 'bevelSize', 0, 3)
        .onChange(redrawTextGeometry)
    textPropertiesFolder
        .add(textGeometryProperties, 'bevelSegments', 1, 8).step(1)
        .onChange(redrawTextGeometry)
    textPropertiesFolder.open()

    // Redraw the textGeometry
    function redrawTextGeometry() {
        let newGeometry = new TextGeometry (
            textString, {
                font: textGeometryProperties.font,
                size: textGeometryProperties.size,
                height: textGeometryProperties.height,
                curveSegments: textGeometryProperties.curveSegments,
                bevelEnabled: textGeometryProperties.bevelEnabled,
                bevelOffset: textGeometryProperties.bevelOffset,
                bevelThickness: textGeometryProperties.bevelThickness,
                bevelSize: textGeometryProperties.bevelSize,
                bevelSegments: textGeometryProperties.bevelSegments
            }
        )
        text.geometry.dispose()
        text.geometry = newGeometry
        text.geometry.parameters.options.depth = 0.2

        newGeometry.center()
        console.log('textGeometry:',text.geometry.parameters.options)

        }
    }
)

// Donuts
const scaleGenerator = (min, max, decimalPoints) => {
    return Number((Math.random() * (min - max) + max).toFixed(decimalPoints))
}

function donutGenerator() {

    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64)
    const donutCount = { count: 50 }

    for (let i = 0; i < donutCount.count; i++) {

        const donut = new THREE.Mesh(donutGeometry, material)

        // Donut Position
        donut.position.x = (Math.random() - 0.5) * donutCount.count
        donut.position.y = (Math.random() - 0.5) * donutCount.count
        donut.position.z = (Math.random() - 0.5) * donutCount.count

        // Donut Rotation
        donut.rotation.x = Math.random() * Math.PI
        donut.rotation.y = Math.random() * Math.PI

        const scale = scaleGenerator(0.5, 3.5, 3) // min, max, decimalPoints
        donut.scale.set(scale, scale, scale)

        scene.add(donut)

    }

}

// function parentDonutGenerator() {
//
//     const parentDonutGeometry = new THREE.Object3D()
//     parentDonutGeometry.add(donutGenerator.donut)
//     scene.add(parentDonutGeometry)
// }

console.time('donuts load time')
donutGenerator()
//parentDonutGenerator()
console.timeEnd('donuts load time')

// GUI for donutGenerator
// const donutPropertiesFolder = gui.addFolder('Donut Properties')
// donutPropertiesFolder
//     .add(donutGenerator.scaleGenerator, 'min', 0.1, 0.5)
//     .step(donutGenerator.scaleGenerator.decimalPoints)
// donutPropertiesFolder
//     .add(donutGenerator.scaleGenerator, 'max', 0.5, 7.5)
//     .step(donutGenerator.scaleGenerator.decimalPoints)
// donutPropertiesFolder
//     .add(donutGenerator.scaleGenerator, 'decimalPoints', 1, 5)
//     .step(1)

// donutPropertiesFolder.open()

/**
 * Sizes
 */
const sizes =
{
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 50
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
