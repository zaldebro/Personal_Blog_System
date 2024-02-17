import React, {useEffect, useState} from "react";
import axios from "axios";
import {MdPreview} from "md-editor-rt";
import {Flex, Spin} from 'antd';
import "./DR.css"

export default function RD(){
    const editStyle = {
        marginTop: '10px',
        textAlign: 'left',
    }

    const [meData, setMeData] = useState()
    // 请求博客列表数据
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/metrics/show')
                const blogList = response.data
                setMeData(blogList)
            } catch (error){
                console.log("error: ", error)
            }
        }
        fetchData();
    }, [])

    return (
        <>
            <a href="#">点击前往Prometheus</a>
            {meData ? (
                <MdPreview style={editStyle} modelValue={meData} />
            ) : (
                <Flex gap="large" vertical>
                    <Spin tip="Loading" size="large">
                        <div className="content" />
                    </Spin>
                </Flex>
            )}
        </>
    )
}




















