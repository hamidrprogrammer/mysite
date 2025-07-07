
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-Q95NQS2Q0W');
    


        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
    
        ym(98861322, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true
        });
    


    //PRELOADER ANIMATION
    const   PRELOADER_BACKGROUND = "#preloader-background",
            PRELOADER_CONTAINER = "#preloader-wrapper",
            COUNTER_CONTAINER = "#preloader-counter",
            COUNTER_ELEMENT = [
                document.getElementById("counter1"),
                document.getElementById("counter2"),
                document.getElementById("counter3")
            ],
            REFERENCE = document.getElementById("counter1-pic");
    var numberHeight = REFERENCE.offsetHeight/2;
    var counterIndex = 1;
    var pageIsDone = false;

    if (window.matchMedia("(min-width: 768px)").matches) {

        if (numberHeight == 0) { numberHeight = 284 / 2; }

        var preloaderFinalState = gsap.timeline({
            onComplete: () => { preloaderIsDone = true }
        });


        preloaderFinalState
            .to(PRELOADER_BACKGROUND, {
                yPercent: -100,
                duration: 1.4,
                ease: "power3.inOut"
            }, "<")

            .to(COUNTER_CONTAINER, {
                yPercent: 150,
                ease: "power1.inOut"
            })
            .to(PRELOADER_CONTAINER, {
                autoAlpha: 0,
                ease: "power2.inOut"
            }, "<")
            .set(PRELOADER_CONTAINER, {
                yPercent: -100
        }).pause();


        function preloaderLoop() { 
        //  create a loop function
        setTimeout(function() {   //  call a 3s setTimeout when the loop is called
            
            gsap.to(COUNTER_ELEMENT[2], {
                y: -numberHeight*counterIndex*3,
                duration: 0.2,
                ease: "power4.inOut"
            });
            gsap.to(COUNTER_ELEMENT[1], {
                y: -numberHeight*counterIndex,
                duration: 0.3,
                ease: "power3.inOut"
            });

            counterIndex++; 

            if (pageIsDone || counterIndex == 10) {
                //console.log('readyState:' + document.readyState);
                gsap.to(COUNTER_ELEMENT[2], {
                    y: -numberHeight*30,
                    duration: 0.3,
                    ease: "power4.inOut"
                });
                gsap.to(COUNTER_ELEMENT[1], {
                    y: -numberHeight*10,
                    duration: 0.5,
                    ease: "power3.inOut"
                })
                gsap.to(COUNTER_ELEMENT[0], {
                    y: -numberHeight,
                    duration: 0.3,
                    ease: "power2.inOut"
                });
                preloaderFinalState.play();
            } 
            else if (counterIndex < 10) { preloaderLoop(); }                

        }, 600);

        }

        document.addEventListener("DOMContentLoaded", () => {
            pageIsDone = true;
        });

        preloaderLoop();  

    } 
    else {
        gsap.to(".preloader-halo-mobile", {
            "--shadowPreloader": "3em",
            yoyo: true,
            repeat: -1,
            duration: 1
        });

        window.addEventListener("DOMContentLoaded", () => {
            gsap.to(".preloader-wrapper", {
                xPercent: -100
            });
            preloaderIsDone = true;
        });
    }
    


                precision mediump float;
                uniform vec2 iResolution;
                uniform vec2 iMouse;
                uniform float iTime;
                float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed)
                {
                    vec2 sourceToCoord = coord - raySource;
                    float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);
                    return clamp(
                        (0.45 + 0.15 * sin(cosAngle * seedA + iTime * speed)) +
                        (0.3 + 0.2 * cos(-cosAngle * seedB + iTime * speed)),
                        0.0, 1.0) *
                        clamp((iResolution.x - length(sourceToCoord)) / iResolution.x, 0.5, 1.0);
                }
                void mainImage(out vec4 fragColor, in vec2 fragCoord)
                {
                        vec2 uv = fragCoord.xy / iResolution.xy;
                    uv.y = 1.0 - uv.y;
                    vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
                    // Set the parameters of the sun rays
                    vec2 rayPos1 = vec2(iResolution.x * 0.5, iResolution.y * 0.3);
                    vec2 rayRefDir1 = normalize(vec2(1.0, -0.116));
                    float raySeedA1 = 46.2;
                    float raySeedB1 = 21.2;
                    float raySpeed1 = 1.4;
                    vec2 rayPos2 = vec2(iResolution.x * 0.5, iResolution.y * 0.3);
                    vec2 rayRefDir2 = normalize(vec2(1.0, 0.241));
                    const float raySeedA2 = 22.2;
                    const float raySeedB2 = 18.0;
                    const float raySpeed2 = 0.6;
                    // Calculate the colour of the sun rays on the current fragment
                    vec4 rays1 =
                        vec4(1.0, 1.0, 0.918, 1.0) *
                        rayStrength(rayPos1, rayRefDir1, coord, raySeedA1, raySeedB1, raySpeed1);
                    vec4 rays2 =
                        vec4(1.0, 1.0, 0.918, 1.0) *
                        rayStrength(rayPos2, rayRefDir2, coord, raySeedA2, raySeedB2, raySpeed2);
                    fragColor = rays1 * 0.3 + rays2 * 0.2;
                    // Attenuate brightness towards the bottom, simulating light-loss due to depth.
                    // Give the whole thing a blue-green tinge as well.
                    float brightness = 0.9 - (coord.y / iResolution.y);
                    fragColor.x *= 0.1 + (brightness * 1.0);
                    fragColor.y *= 0.1 + (brightness * 1.0);
                    fragColor.z *= 0.1 + (brightness * 1.0);
                }
                void main()
                {
                    mainImage( gl_FragColor, gl_FragCoord.xy );
                }
            


                attribute vec2 inPos;
                void main()
                {
                    gl_Position = vec4(inPos, 0.0, 1.0);
                }
            