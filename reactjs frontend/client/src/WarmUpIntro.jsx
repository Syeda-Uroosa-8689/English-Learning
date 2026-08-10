import React,{useEffect,useState} from "react";

function WarmUpIntro({onFinish}){

    const [show,setShow]=useState(false);

    useEffect(()=>{

        setTimeout(()=>{

            setShow(true);

        },100);

        const timer=setTimeout(()=>{

            setShow(false);

            setTimeout(()=>{

                onFinish();

            },500);

        },4000);

        return()=>clearTimeout(timer);

    },[]);

    return(

        <div className="warmup-intro-container">

            <div className={show?"warmup-popup show":"warmup-popup"}>

                <h1>Warm-Up</h1>

            </div>

        </div>

    );

}

export default WarmUpIntro;