import {useParams} from 'react-router-dom';
import React, {useEffect, useState} from "react";
import axios from "axios";
import {MdPreview} from "md-editor-rt";

import {blogImg, tagColor, tagIcon} from "../../tools/tools";


import {Divider, Tag, Typography, Image} from 'antd';
import {BugTwoTone} from "@ant-design/icons";
const { Title, Paragraph, Text, Link } = Typography;


export default function BlogContent(){

    let params = useParams()
    let blogId = params.blogId
    const [blogInfo, setBlogInfo] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/blog/info/' + blogId)
                const tmpblogInfo = response.data.blogInfo
                setBlogInfo(tmpblogInfo);
            } catch (error){
                console.log("error: ", error)
            }
        }
        fetchData();
    }, [])

    return (
        <>
            <div style={{
                textAlign: 'left',
            }}>
                <Paragraph>
                    <ul>
                        <li>
                            <Text strong>发布时间： </Text>{blogInfo.Date}
                        </li>
                        <li>
                            <Text strong>拥有标签：</Text>
                            {
                                blogInfo.Tags && blogInfo.Tags.length > 0 ? (blogInfo.Tags.map((tag, index)=>{
                                    return <Tag key={index} color={tagColor[index%tagColor.length]} bordered={false} icon={tagIcon[index%tagIcon.length]}> {tag} </Tag>
                                })) : (<Tag color="red" bordered={false} icon={<BugTwoTone />}> 暂无标签 </Tag>)
                            }
                        </li>
                    </ul>
                </Paragraph>
                <Divider />

                <Image
                    width='50%'
                    height='auto'
                    src={blogImg[Math.floor(Math.random() * blogImg.length)]}
                />
                <MdPreview modelValue={blogInfo.Content} />
                <Divider />

            </div>


        </>
    )

}