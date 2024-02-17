import React, {useState} from 'react';
import {
    HomeOutlined, HomeTwoTone,
    PieChartTwoTone,
    BookTwoTone,
} from '@ant-design/icons';
import {Layout, Menu, theme, Typography, Avatar, Breadcrumb, Tooltip} from 'antd';
import {Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import Snowfall from 'react-snowfall'

import '../css/GlobalLayout.css'
import {Logo} from "../tools/tools";
import BlogList from "./Blog/BlogList";
import GlobalFloatButton from "./GlobalFloatButton";
import BlogPublish from "./Blog/BlogPublish";

import {BlogManage} from "./Blog/BlogManage";
import RD from "./Metrics/RD";
import LS from "./Metrics/LS";
import BlogContent from "./Blog/BlogContent";
import BlogIndex from "./Blog/BlogIndex";

import musicDst from "../assets/music/fireworksGetColdEasily.mp3";

const { Header, Content, Footer, Sider } = Layout;
const { Text, Link } = Typography;


const siderMenuData = [
    {
        key: '/',
        icon: <HomeTwoTone />,
        label: '首页',
    },
    {
        key: '/blog',
        icon: <BookTwoTone />,
        label: '博客',
        children: [
            {
                key: '/blog/list',
                label: '列表'
            },
            {
                key: '/blog/publish',
                label: '发布'
            },
            {
                key: '/blog/manage',
                label: '管理'
            },
        ]
    },
    {
        key: '/metrics',
        icon: <PieChartTwoTone />,
        label: '监控页',
        children: [
            {
                key: '/metrics/LS',
                label: '大屏'
            },
            {
                key: '/metrics/RD',
                label: 'RD'
            },
        ]
    },
]

// 使用递归的方式查找当前页面刷新之后的默认选中项
const findOpenKeys = (key) => {
    const result = [];
    const findInfo = (arr) => {
        arr.forEach((item)=>{
            if (key.includes(item.key)){
                result.push(item.key)
                if (item.children){
                    findInfo(item.children)
                }
            }
        })
    }
    findInfo(siderMenuData)
    if (result.length > 1 && result[0] === '/'){
        result.shift()
    }
    return result
}
// 使用递归的方式查找当前页面刷新之后的默认选中项，将label推入result实现面包屑
const findBreadcrumb = (key) => {
    const result = [];
    result.push({title: <HomeOutlined />})
    const findInfo = (arr) => {
        arr.forEach((item)=>{
            if (key.includes(item.key)){
                result.push({title: item.label})
                if (item.children){
                    findInfo(item.children)
                }
            }
        })
    }
    findInfo(siderMenuData)
    if (result.length > 2 && result[1].title === '首页'){
        result.splice(1,1)
    }
    return result
}

export default function GlobalLayout (){
    const navigate = useNavigate();
    const { pathname } = useLocation(); // 获取location中的数据
    const tmpOpenKeys = findOpenKeys(pathname);
    const tmpBreadcrumb = findBreadcrumb(pathname);

    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <>
            <Snowfall
                color="#673ab7"
                style={{ position: "fixed", zIndex: "1"}}
                snowflakeCount={200} />
            <Layout hasSider>
                <Sider
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        background: colorBgContainer,
                        left: 0,
                        top: 0,
                        bottom: 0,
                    }}
                >

                    <div className="avatar-container" style={{
                        marginLeft: '6vh',
                        marginTop: '8vh',
                        marginBottom: '2vh',
                    }}>
                    <Tooltip placement="rightTop" color="pink" title={ isPlaying ? ' 暂停 “烟花易冷”' : ' 来首 “烟花易冷”'}>
                    <Avatar src={Logo} size={100} alt='我的头像不见了！'
                            onClick={togglePlay}
                            draggable={false}
                            // style={{
                            //     boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)', // 添加阴影效果
                            // }}
                    />
                        </Tooltip>
                        {isPlaying && (
                            <embed hidden={true} src={musicDst}/>
                        )}
                    </div>

                    <Text keyboard style={{
                        marginLeft: '5vh',
                    }}>江苏大学 傅庆飞</Text>

                    <Menu
                        theme="light"
                        mode="inline"
                        defaultSelectedKeys={tmpOpenKeys}
                        defaultOpenKeys={tmpOpenKeys}
                        style={{
                            marginTop: '10vh'
                        }}
                        onClick={(key)=>{
                            navigate(key.key);
                        }}
                        items={siderMenuData} />

                </Sider>

                <Layout
                    className="site-layout"
                    style={{
                        marginLeft: 200,
                    }}
                >

                    <Header
                        style={{
                            padding: 0,
                            background: colorBgContainer,
                            textAlign: "center",
                            flex: "auto",
                        }}>

                        <Text keyboard >沉舟侧畔千帆过，病树前头万木春</Text>
                    </Header>

                    <Content
                        style={{
                            margin: '24px 16px 0',
                            overflow: 'initial',
                        }}
                    >
                        <Breadcrumb items={tmpBreadcrumb}
                                    style={{
                                        marginBottom: '5px',
                                    }}/>

                        <div
                            style={{
                                padding: 24,
                                textAlign: 'center',
                                background: colorBgContainer,
                            }}
                        >

                            <Routes>
                                <Route path='/' element={<BlogIndex/>}/>
                                <Route path='/blog/list' element={<BlogList/>}/>
                                <Route path='/blog/info/:blogId' element={<BlogContent/>}/>
                                <Route path='/blog/manage' element={<BlogManage/>}/>
                                <Route path='/blog/publish' element={<BlogPublish/>}/>

                                <Route path='/metrics/RD' element={<RD/> }/>
                                <Route path='/metrics/LS' element={<LS/> }/>

                            </Routes>

                            {
                                Array.from(
                                    {
                                        length: 10,
                                    },
                                    (_, index) => (
                                        <React.Fragment key={index}>
                                            {index % 20 === 0 && index ? 'more' : '...'}
                                            <br />
                                        </React.Fragment>
                                    ),
                                )
                            }
                        </div>
                    </Content>

                    <Footer
                        style={{
                            textAlign: 'center',
                        }}
                    >
                        <GlobalFloatButton />
                        Ant Design ©2023 Created by Ant UED
                    </Footer>
                </Layout>
            </Layout>
        </>

    );
};
