import React from 'react';
import {Collapse, Timeline, Result, Badge} from 'antd';
import ReactEcharts from "echarts-for-react"
import {ClockCircleOutlined, SmileOutlined} from "@ant-design/icons";
import { Divider, Typography } from 'antd';
const { Title, Paragraph, Text, Link } = Typography;

const blogLogData = [
    {
        children: '2021-09-22 到江苏大学报道🚗✔🧗‍♂️（学校外号爬坡大学你懂的）',
        color: 'blue',
    },
    {
        children: '2021-11-12 参加学校前端实训活动，啥也不会。。。',
        color: 'red',
    },
    {
        children: '2021-11-27 开始学习Linux云计算运维，又菜又爱学😃（哈哈）',
        color: 'green',
    },
    {
        children: '2021-12-06 通过CET4，577分😊（高分，开心）',
        color: 'blue',
    },
    {
        children: '2022-08-08 获得机动车驾驶证C1，科目一、二、三各考了两遍😩（蓝瘦香菇）',
        color: 'green',
    },
    {
        children: '2022-08-25 通过CET6，457分',
        color: 'red',
    },
    {
        children: '2022-12-26 获得华为ICT大赛2022-2023中国区江苏省实践赛省一等奖',
        color: 'gray',
    },
    {
        children: '2023-04-07 获得联东集团信息化实习生offer，辅导员不同意，没走成😢（哭泣）',
        color: 'green',
    },
    {
        children: '2023-05-11 通过计算机二级-MySQL数据库程序设计',
        color: 'blue',
    },
    {
        children: '2023-06-02 获得杭州安恒信息技术股份有限公司运维开发实习生offer',
        color: 'green',
    },
    {
        dot: (
            <ClockCircleOutlined
                style={{
                    fontSize: '16px',
                }}
            />
        ),
        children: `2023-10-12 通过RedHat认证RHCSA和RHCE，得分分别为286和290（满分300）`,
    },
    {
        color: 'red',
        children: '2023-10-21 开始开发本站',
    },
    {
        dot: (
            <ClockCircleOutlined
                style={{
                    fontSize: '16px',
                }}
            />
        ),
        children: '2024-01-13 在blog中添加 describe ，正则匹配添加 Tag、面包屑',
    },
    {
        color: 'red',
        children: '2024-01-27 为本站添加大屏和监控的原始数据情况',
    },
    {
        color: 'blue',
        children: '2024-02-01 将博客的分组功能完成',
    },
    {
        color: 'red',
        children: '2024-02-02 完成一些样式的随即展示（例如博客的图片），发布和访问博客功能',
    },
    {
        color: 'gray',
        children: '2024-02-03 完善博客的分组的增加和删除功能',
    },
    {
        children: '2024-02-05 涉及监控大屏和首页部分内容',
        color: 'blue',
    },
    {
        children: '2024-02-07 完成监控大屏部分',
        color: 'red',
    },
    {
        children: '2024-02-13 完善首页手风琴的内容，增加音乐播放',
        color: 'gray',
    },
    {
        color: 'green',
        children: '今天，本站呈现在您的面前😊',
    },

]

export default function  BlogIndex ()  {

    const collapseItems = [
        {
            key: '1',
            label: '本站功能介绍',
            children: <p>{<Typography>
                本站主要有两个功能块：
                <blockquote>注意，涉及修改数据库的相关操作已被关闭</blockquote>
                <Paragraph>
                    <Text strong>博客功能块</Text>
                    <ul>
                        <li>
                            列表路由，查看所有博客列表以及相关标签
                        </li>
                        <li>
                            发布路由，在线预览并发布一篇自己的博客，同时选择相关标签
                        </li>
                        <li>
                            管理路由，可以查看每个分组的简单信息和该分组拥有的博客成员，并且对博客成员执行增删改查操作
                        </li>
                    </ul>
                </Paragraph>

                <Paragraph>
                    <Text strong>监控功能块</Text>
                    <ul>
                        <li>
                            大屏路由可以查看本机的监控情况，包括系统负载、内存、磁盘和网络的情况。初次加载时间较慢
                        </li>
                        <li>
                            RD路由，即使用Prometheus编写监控metrics情况的原始数据
                        </li>
                    </ul>
                </Paragraph>
            </Typography>}
            </p>,
        },
        {
            key: '2',
            label: '本站相关模块',
            children: <p>{
                <Typography>
                    <Paragraph>
                        本站的构建使用了如下模块：
                        <ul>
                            <li>
                                整体页面：<a href="https://ant-design.antgroup.com/index-cn" target="_blank">Ant Design - 一套企业级UI 设计语言和React 组件库</a>
                            </li>
                            <li>
                                雪花特效：<a href="https://github.com/cahilfoley/react-snowfall" target="_blank">react-snowfall</a>
                            </li>
                            <li>
                                md文档：<a href="https://github.com/imzbf/md-editor-rt " target="_blank">md-editor-rt</a>
                            </li>
                            <li>
                                监控大屏：<a href="https://github.com/hustcc/echarts-for-react" target="_blank">echarts-for-react</a>
                            </li>
                            <li>
                                数据请求：<a href="https://www.axios-http.cn/" target="_blank">axios</a>
                            </li>
                            <li>
                                路由功能：<a href="https://reactrouter.com/en/main" target="_blank">react-router-dom</a>
                            </li>
                        </ul>
                    </Paragraph>
            </Typography>}</p>,
        },
        {
            key: '3',
            label: '日志',
            children: <p>{<Timeline
                mode="alternate"
                items={blogLogData}
            />}</p>,
        },
    ];

    const textOption = {
        graphic: {
            elements: [
                {
                    type: 'text',
                    left: 'center',
                    top: 'center',
                    style: {
                        text: 'Welcome to My Site！',
                        fontSize: 70,
                        fontWeight: 'bold',
                        lineDash: [0, 200],
                        lineDashOffset: 0,
                        fill: 'transparent',
                        stroke: '#673ab7',
                        lineWidth: 1
                    },
                    keyframeAnimation: {
                        duration: 2000,
                        loop: false,
                        keyframes: [
                            {
                                percent: 0.7,
                                style: {
                                    fill: 'transparent',
                                    lineDashOffset: 200,
                                    lineDash: [200, 0]
                                }
                            },
                            {
                                // Stop for a while.
                                percent: 0.8,
                                style: {
                                    fill: 'transparent'
                                }
                            },
                            {
                                percent: 1,
                                style: {
                                    fill: '#673ab7'
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };

    return (
        <>

            <Badge.Ribbon text="Hello!" color="pink">
                <ReactEcharts option={textOption} />
            </Badge.Ribbon>

            <Collapse style={{
                    textAlign: "left"
                }} size="large" defaultActiveKey={['1']} items={collapseItems} />

            <Result style={{
                    backgroundColor: 'white'
                }}
                status='success'
                icon={<SmileOutlined />}
                title="本部分内容结束，感谢您的浏览！"
                // extra={<Button type="primary"> Back </Button>}
            />

        </>
    );
};
