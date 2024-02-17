import React, {useEffect, useState} from 'react';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import {Avatar, List, Space, Typography, Tag, message} from 'antd';
import axios from "axios";
import {useNavigate} from "react-router-dom";


import BlogCarousel from "./BlogCarousel";
import {UserAvatar, blogImg, tagColor, tagIcon} from "../../tools/tools";

const { Text, Link } = Typography;

const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);



export default function BlogList(){

    const navigate = useNavigate();

    const [messageApi, contextHolder] = message.useMessage();

    const warning = (type, content) => {
        messageApi.open({
            type: type,
            content: content,
        });
    }

    const [teData, setTeData] = useState([])
    // 请求博客列表数据
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/blog/list')
                const tmpDataList = []
                const blogList = response.data.blogList
                for (let i = 0; i<blogList.length; i++){
                    const tmpData = {
                        Id : blogList[i].Id,
                        Title: blogList[i].Title,
                        Content: blogList[i].Content,
                        Date : blogList[i].Date,
                        Tags: blogList[i].Tags,
                    }
                    tmpDataList.push(tmpData);
                }
                setTeData(tmpDataList)
            } catch (error){
                console.log("error: ", error)
            }
        }
        fetchData();
    }, [])


    return (
        <>
            {contextHolder}
            <BlogCarousel />

            <List
                itemLayout="vertical"
                size='small'
                pagination={{
                    onChange: (page) => {
                        console.log(page);
                    },
                    pageSize: 3,
                }}
                dataSource={teData}
                header={
                    <Text keyboard>博客列表</Text>
                }
                footer={
                    <div>
                        <b>qingfei fu @</b> zadebro
                    </div>
                }

                renderItem={(item) => (
                    <List.Item style={{textAlign:"left"}}
                        key={item.Id}
                        actions={[
                            <a onClick={ () => { warning("error", "暂时未开放！") } }>
                                <IconText icon={StarOutlined} text="156" key="list-vertical-star-o"/> </a>,

                            <a onClick={ () => { console.log("start!") } }>
                                <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o"/> </a>,

                            <a onClick={ () => { warning("error", "暂时未开放！") } }>
                                <IconText icon={MessageOutlined} text="2" key="list-vertical-message"/> </a>,
                        ]}
                        extra={
                            <img
                                width={272}
                                alt="logo"
                                src={blogImg[Math.floor(Math.random() * blogImg.length)]}
                                // src="https://ts1.cn.mm.bing.net/th/id/R-C.f303b2973c7c04d2d8d2626c13badec4?rik=UpwRb1750YzSIA&riu=http%3a%2f%2fimg.sccnn.com%2fbimg%2f343%2f201102145106-5.jpg&ehk=9BEO%2bVveYyALWybaajiB4BG20HKML5LVUgejjoVPbHg%3d&risl=&pid=ImgRaw&r=0"
                            />
                        }>

                        <List.Item.Meta
                            avatar={<Avatar src={UserAvatar} size={55} style={{
                                marginTop: "3px"
                            }}/>}
                            title={<>
                                <a onClick={ ()=> {navigate("/blog/Info/" + item.Id.toString())} }>{item.Title}</a> &nbsp;

                                {
                                    item.Tags && item.Tags.map((tag, index)=>{
                                        return <Tag key={index} color={tagColor[Math.floor(Math.random() * tagColor.length)]} bordered={false} icon={tagIcon[Math.floor(Math.random() * tagIcon.length)]}> {tag} </Tag>
                                    })
                                }
                            </>}
                            description={"最新发布时间：" + item.Date}
                        />

                        {item.Content}

                    </List.Item>
                )}
            />
        </>
    )
};
