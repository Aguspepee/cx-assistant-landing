import * as React from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useColorScheme } from '@mui/material/styles';

// A React + Three.js laptop section that opens with scroll and plays our videos on the screen
export default function LaptopShowcase() {
    const wrapperRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

    const { mode, systemMode } = useColorScheme();
    const resolvedMode = mode === 'system' ? systemMode : mode;
    const isDark = resolvedMode === 'dark';

    // Theme-aware list of video sources in public/videos
    const videoBases = React.useMemo(
        () => [
            '/videos/hero/issues',
            '/videos/hero/planner',
        ],
        []
    );
    const themedSources = React.useMemo(
        () => videoBases.map((b) => `${b}-${isDark ? 'dark' : 'light'}.mp4`),
        [isDark, videoBases]
    );

    React.useEffect(() => {
        const container = wrapperRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        // Tweak these to change size and vertical offset of the laptop in frame
        const LAPTOP_SCALE = 1.3; // 1.0 = default size. Increase to make bigger
        const LIFT_Y =2.5; // units to lift the laptop upward in the frame

        // Respect reduced motion
        const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

        // Three basics
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, 1, 10, 2000);
        camera.position.set(0, 0, 78); // a hair further for safe framing

        // Lights
        const ambient = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambient);
        const lightHolder = new THREE.Group();
        scene.add(lightHolder);
        const point = new THREE.PointLight(0xfff5e1, 0.8);
        point.position.set(0, 5, 50);
        lightHolder.add(point);

        // RectAreaLight requires uniforms lib init
        RectAreaLightUniformsLib.init();

        // Removed orbit controls — static framing only

        // Groups from model
    const macGroup = new THREE.Group();
    macGroup.position.set(0, 0, -10); // base position, we'll animate toward LIFT_Y
    macGroup.scale.set(LAPTOP_SCALE, LAPTOP_SCALE, LAPTOP_SCALE);
        scene.add(macGroup);
        const lidGroup = new THREE.Group();
        macGroup.add(lidGroup);
        const bottomGroup = new THREE.Group();
        macGroup.add(bottomGroup);

        // Materials
        const texLoader = new THREE.TextureLoader();
        const darkPlasticMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.9, metalness: 0.9 });
        const cameraMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
        const baseMetalMaterial = new THREE.MeshStandardMaterial({ color: 0xcecfd3 });
        const logoMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

        // Screen and keyboard resources
        const screenSize: [number, number] = [29.4, 20];
        const keyboardTexture = texLoader.load('https://ksenia-k.com/img/threejs/keyboard-overlay.png');
        const keyboardMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, alphaMap: keyboardTexture, transparent: true });

        // Video setup
        const videoEl = document.createElement('video');
        videoEl.crossOrigin = 'anonymous';
        videoEl.playsInline = true;
        videoEl.muted = true;
        videoEl.loop = true;
        videoEl.preload = 'metadata';
        let currentIndex = 0;
        const setVideoSrc = (src: string) => {
            if (videoEl.src !== src) {
                videoEl.src = src;
                // Attempt autoplay once source is set
                videoEl.play().catch(() => { /* ignore */ });
            }
        };
        setVideoSrc(themedSources[currentIndex] || '');

        const screenVideoTexture = new THREE.VideoTexture(videoEl);
        screenVideoTexture.colorSpace = THREE.SRGBColorSpace;

        // Show video in natural orientation (no mirroring)
        screenVideoTexture.wrapS = THREE.ClampToEdgeWrapping;
        screenVideoTexture.wrapT = THREE.ClampToEdgeWrapping;
        screenVideoTexture.repeat.set(1, 1);
        screenVideoTexture.offset.set(0, 0);

        const screenMaterial = new THREE.MeshBasicMaterial({
            map: screenVideoTexture,
            transparent: true,
            opacity: 0.0,
            side: THREE.BackSide, // matches the 180° rotation below
        });

        // Build screen plane + light (manual, model lacks UVs)
        const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(screenSize[0], screenSize[1]), screenMaterial);
        screenMesh.position.set(0, 10.5, -0.11);
        screenMesh.rotation.set(Math.PI, 0, 0);
        lidGroup.add(screenMesh);

        const screenLight = new THREE.RectAreaLight(0xffffff, 0, screenSize[0], screenSize[1]);
        screenLight.position.set(0, 10.5, 0);
        screenLight.rotation.set(Math.PI, 0, 0);
        lidGroup.add(screenLight);

        // Dark back panel under screen
        const darkScreen = new THREE.Mesh(new THREE.PlaneGeometry(screenSize[0], screenSize[1]), darkPlasticMaterial);
        darkScreen.position.set(0, 10.5, -0.111);
        darkScreen.rotation.set(Math.PI, Math.PI, 0);
        lidGroup.add(darkScreen);

        // Keyboard overlay
        const keyboardKeys = new THREE.Mesh(new THREE.PlaneGeometry(27.7, 11.6), keyboardMaterial);
        keyboardKeys.rotation.set(-0.5 * Math.PI, 0, 0);
        keyboardKeys.position.set(0, 0.045, 7.21);
        bottomGroup.add(keyboardKeys);

        // Load laptop model
        let disposed = false;
        const loader = new GLTFLoader();
        loader.load(
            'https://ksenia-k.com/models/mac-noUv.glb',
            (glb) => {
                if (disposed) return;
                for (const child of [...glb.scene.children]) {
                    if ((child as any).name === '_top') {
                        lidGroup.add(child);
                        for (const mesh of [...(child as any).children]) {
                            const name = (mesh as any).name;
                            if (name === 'lid') (mesh as any).material = baseMetalMaterial;
                            else if (name === 'logo') (mesh as any).material = logoMaterial;
                            else if (name === 'screen-frame') (mesh as any).material = darkPlasticMaterial;
                            else if (name === 'camera') (mesh as any).material = cameraMaterial;
                        }
                    } else if ((child as any).name === '_bottom') {
                        bottomGroup.add(child);
                        for (const mesh of [...(child as any).children]) {
                            const name = (mesh as any).name;
                            if (name === 'base') (mesh as any).material = baseMetalMaterial;
                            else if (name === 'legs') (mesh as any).material = darkPlasticMaterial;
                            else if (name === 'keyboard') (mesh as any).material = darkPlasticMaterial;
                            else if (name === 'inner') (mesh as any).material = darkPlasticMaterial;
                        }
                    }
                }
            },
            undefined,
            () => {
                // Ignore model load error; still show section gracefully
            }
        );

        // Initial transforms/pose (centered, closed)
        macGroup.rotation.set(0.5 * Math.PI, 0.2 * Math.PI, 0);
        macGroup.position.y = 0; // stay centered
        lidGroup.rotation.x = 0.5 * Math.PI; // closed

        // Resize handling
        const setSize = () => {
            const { clientWidth: w, clientHeight: ch } = container;
            const h = ch || Math.max(300, Math.round(w * 0.5625)); // prefer CSS aspect-ratio height
            renderer.setSize(w, h, false);
            camera.aspect = w / Math.max(1, h);
            camera.updateProjectionMatrix();
        };
        setSize();
        const resizeObs = new ResizeObserver(setSize);
        resizeObs.observe(container);

        // Visible state
        let inView = false;
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) inView = e.isIntersecting;
            },
            { root: null, rootMargin: '200px 0px', threshold: 0.1 }
        );
        io.observe(container);

        // Scroll-coupled opening progress based on visible ratio
        let openProgress = 0; // 0..1
        const visibleRatioOf = (rect: DOMRect) => {
            const vh = window.innerHeight || document.documentElement.clientHeight;
            const top = Math.max(0, rect.top);
            const bottom = Math.min(vh, rect.bottom);
            const visible = Math.max(0, bottom - top);
            return Math.max(0, Math.min(1, visible / rect.height));
        };
        const easeInOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

        const updateOpenProgress = () => {
            const rect = container.getBoundingClientRect();
            const vr = visibleRatioOf(rect);
            const t = Math.max(0, Math.min(1, (vr - 0.15) / 0.70)); // start at 15%, end by ~85%
            openProgress = easeInOut(t);
        };
        updateOpenProgress();
        const onScroll = () => updateOpenProgress();
        window.addEventListener('scroll', onScroll, { passive: true });

        // Auto-cycle videos once opened a bit (unchanged threshold)
        let cycleTimer: number | null = null;
        const ensureCycle = () => {
            if (cycleTimer != null) return;
            cycleTimer = window.setInterval(() => {
                if (openProgress < 0.5) return; // wait until somewhat open
                currentIndex = (currentIndex + 1) % themedSources.length;
                setVideoSrc(themedSources[currentIndex]);
            }, 8000);
        };

        // Animate
        let raf = 0;
        const animate = (t: number) => {
            // Floating motion if in view
            const float = inView && !prefersReduced ? Math.sin(t * 0.001) * 1.0 : 0;
            lidGroup.position.y = float * 0.5;
            bottomGroup.position.y = float * 0.5;

            // Keep the whole group centered but lifted a bit
            const appearTargetY = LIFT_Y;
            macGroup.position.y += (appearTargetY - macGroup.position.y) * 0.08;

            // Subtle, fixed orientation so it stays within the frame
            const rxTarget = 0.06 * Math.PI;
            const ryTarget = -0.10 * Math.PI;
            macGroup.rotation.x += (rxTarget - macGroup.rotation.x) * 0.04;
            macGroup.rotation.y += (ryTarget - macGroup.rotation.y) * 0.04;

            // Lid opening based on visible ratio progress
            const closed = 0.5 * Math.PI;
            const opened = -0.2 * Math.PI;
            lidGroup.rotation.x += ((closed + (opened - closed) * openProgress) - lidGroup.rotation.x) * 0.12;

            // Screen fade/brightness with open progress
            screenMaterial.opacity = Math.max(0, Math.min(1, openProgress * 1.1));
            screenLight.intensity = 1.5 * openProgress;

            // Keep point light aimed for nice spec
            lightHolder.quaternion.copy(camera.quaternion);

            // Render
            renderer.render(scene, camera);

            // Manage video cycle
            if (openProgress > 0.4) ensureCycle();

            raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);

        // Visibility pause/resume
        const onVis = () => {
            if (document.hidden) {
                if (raf) cancelAnimationFrame(raf);
            } else {
                raf = requestAnimationFrame(animate);
            }
        };
        document.addEventListener('visibilitychange', onVis);

        // Cleanup
        return () => {
            disposed = true;
            document.removeEventListener('visibilitychange', onVis);
            window.removeEventListener('scroll', onScroll);
            io.disconnect();
            resizeObs.disconnect();
            if (cycleTimer != null) {
                window.clearInterval(cycleTimer);
                cycleTimer = null;
            }
            if (raf) cancelAnimationFrame(raf);
            renderer.dispose();
            screenVideoTexture.dispose();
            keyboardTexture.dispose();
            (keyboardKeys.geometry as THREE.BufferGeometry).dispose();
            (keyboardMaterial as THREE.Material).dispose();
            (screenMesh.geometry as THREE.BufferGeometry).dispose();
            (screenMaterial as THREE.Material).dispose();
            (darkScreen.geometry as THREE.BufferGeometry).dispose();
            videoEl.pause();
            videoEl.removeAttribute('src');
            videoEl.load();
        };
    }, [isDark, themedSources]);

    // If theme toggles, React effect above will update source via themedSources

    return (
        <Box component="section" sx={{ py: { xs: 8, sm: 12 } }}>
            <Container>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Typography component="h2" variant="h4" sx={{ textAlign: 'center' }}>
                        Desktop and mobile optimized views
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 720 }}>
                        Experience Cx Assistant seamlessly on any device — optimized layouts and interactions for desktop, tablet, and mobile.</Typography>
                </Box>

                <Box
                    ref={wrapperRef}
                    sx={{
                        width: '100%',
                        position: 'relative',
                        borderRadius: 2,
                        overflow: 'hidden',
                        aspectRatio: { xs: '16/10', sm: '16/9' },
                        bgcolor: 'transparent',
                        //height: 300
                    }}
                >
                    <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
                </Box>
            </Container>
        </Box>
    );
}
