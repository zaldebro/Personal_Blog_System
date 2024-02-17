import React, {useRef} from 'react';
import {Button, Carousel} from 'antd';
import {
    LeftCircleTwoTone,
    RightCircleTwoTone,
} from '@ant-design/icons';

import ujsImg from '../../assets/UJS.jpg'
import ahImg from '../../assets/AH.jpg'
import ictImg from '../../assets/ICT.png'
import rhceImg from '../../assets/RHCE.png'
import scoreImg from '../../assets/RDSCORE.png'

const contentStyle = {
    height: '350px',
    width: '100%',
    lineHeight: '160px',
};

export default function BlogCarousel(){
    const ref = useRef();

    return (
        <>
            <Carousel autoplay
                      draggable
                      pauseOnHover={true}
                      dotPosition='bottom'
                      ref={ref}
                      style={{
                          height: 'auto',
                          width: '70%',
                          marginLeft: "15%"
                      }}
            >
                <div>
                    <img style={contentStyle}
                     src={ujsImg}
                     alt='logo' />
                </div>
                <div>
                    <img style={contentStyle}
                     src={ahImg}
                     alt='logo' />
                </div>
                <div>
                    <img style={contentStyle}
                     src={ictImg}
                     alt='logo' />
                </div>
                <div>
                    <img style={contentStyle}
                     src={rhceImg}
                     alt='logo' />
                </div>
                <div>
                    <img style={contentStyle}
                         src={scoreImg}
                         alt='logo' />
                </div>
            </Carousel>

            <div style={{
                marginTop: '6px',
            }}>

            <Button type="primary"
                shape='circle'
                onClick={()=>{
                    ref.current.prev()
                }}
                icon={<LeftCircleTwoTone />} />

            <Button
                style={{
                    marginLeft: '10px',
                    marginRight: '10px',
                }}
                onClick={()=>{
                    ref.current.goTo(0)
                }}>cover</Button>

            <Button type="primary"
                shape='circle'
                onClick={()=>{
                    ref.current.next()
                }}
                icon={<RightCircleTwoTone />} />
            </div>

        </>
    )
};
