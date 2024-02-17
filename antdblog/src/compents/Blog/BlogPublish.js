import React, {useState} from "react";
import {MdEditor, MdPreview} from "md-editor-rt";
import 'md-editor-rt/lib/style.css'
import {Typography, Cascader, Button, message} from "antd";

import {options} from "../../tools/tools";
import axios from "axios";

const { Text, Link } = Typography;


export default function BlogPublish () {
    const [messageApi, contextHolder] = message.useMessage();
    const warning = (type, content) => {
        messageApi.open({
            type: type,
            content: content,
        });
    }

    const [casChoice, setCasChoice] = useState([]);
    const [blogContent, setBlogContent] = useState();

    const getTitle = (content) => {
        const titleRegex = /^#\s(.+)/;
        const match = content.match(titleRegex);
        return match ? match[1] : '暂无标题';
    }

    const publishBlog = () => {

        if (!blogContent){
            warning("error", "输入博客内容为空！")
            return
        }

        // 注意在这里禁止发布文章！
        const title = getTitle(blogContent);
        const tags = casChoice.map((tag) => tag[0])

        axios.post("/blog/add", {
            title: title,
            content: blogContent,
            tags: tags
        })
            .then(function (response){
                // 这里完成后就直接跳转吧！
                setBlogContent()
                setCasChoice()
                warning("success", "发布成功！")
            })
            .catch(function (error){
                console.log("post failed! error: ", error)
            })
    }

    const handleEditorChange = (text) => {
        setBlogContent(text);
    }

    const editStyle = {
        marginTop: '10px',
        textAlign: 'left',
    }

    const casChange = (value) => {
        setCasChoice(value); // 异步函数，使得casChoice未及时更新，在提交时获取正常
    };

    return (
        <>
            {contextHolder}
            <Text keyboard style={{
                textAlign: 'center'
            }}>在这里发布你的文章！（匿名用户无法发布）</Text>

            <div style={{
                width: '100%',
                marginTop: '5px'
            }}>
                <Cascader
                    style={{
                        width: '40%',
                    }}
                    placeholder='为您的文章添加tag(可多选)'
                    options={options}
                    onChange={casChange}
                    multiple
                    maxTagCount="responsive"
                />
                &nbsp;
                <Button type="dashed" onClick={publishBlog}>发布</Button>
            </div>

            <MdEditor
                onUploadImg={(e)=>{console.log('e--> ', e)}}
                style={editStyle}
                onSave={(content, h) => {
                    setBlogContent(content)
                    h.then((html)=> {

                    })
                }}
                value={blogContent}
                onChange={handleEditorChange}
                preview="edit"
                modelValue={blogContent} />
            &nbsp;
            <Text keyboard
                  style={{
                    textAlign: 'center'
                  }}>下面是全局预览</Text>

            <MdPreview style={editStyle} modelValue={blogContent} />
        </>
    )

}
