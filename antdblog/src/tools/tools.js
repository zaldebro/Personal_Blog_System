import {
    BugTwoTone,
    CompassTwoTone,
    EnvironmentTwoTone,
    EuroCircleTwoTone,
    FileMarkdownTwoTone, FireTwoTone
} from "@ant-design/icons";
import React from "react";

import localImage from '../assets/Logo.png';
import userAvatar from '../assets/userAvatar.jpg'

import blogImg1 from '../assets/blogImg/blogImg1.jpg'
import blogImg2 from '../assets/blogImg/blogImg2.jpg'
import blogImg3 from '../assets/blogImg/blogImg3.jpg'
import blogImg4 from '../assets/blogImg/blogImg4.jpg'
import blogImg5 from '../assets/blogImg/blogImg5.jpg'
import blogImg6 from '../assets/blogImg/blogImg6.jpg'
import blogImg7 from '../assets/blogImg/blogImg7.jpg'


// 博客图片
export const blogImg = [blogImg1, blogImg2, blogImg3, blogImg4, blogImg5, blogImg6, blogImg7]

// 标签相关
export const tagColor = ["processing", "success", "error", "warning", "magenta", "red",
    "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple"]

export const tagIcon = [<EnvironmentTwoTone />, <BugTwoTone />, <CompassTwoTone />, <EuroCircleTwoTone />,
    <FileMarkdownTwoTone />, <FireTwoTone /> ]

export const Logo = localImage
export const UserAvatar = userAvatar


// export const blogData = [
//     {
//         href: '#',
//         title: `故事糖果店`,
//         avatar: 'https://ts1.cn.mm.bing.net/th/id/R-C.a383dad60b9aa151dcc316f2f13ffdf4?rik=wsVE0TpXzhu1qA&riu=http%3a%2f%2fwww.sinaimg.cn%2fdy%2fslidenews%2f21_img%2f2017_09%2f1844_5577253_438116.jpg&ehk=QqO9zOhjgm8917Dv2qjFsFso6BhEfobL9wPnsly3558%3d&risl=&pid=ImgRaw&r=0',
//         description:
//             'Ant Design, a design language for background applications, is refined by Ant UED Team.',
//         content:
//             '无名小镇的小巷子里，开着一家奇妙的糖果店。这里的糖果全是店家老夫妻用故事做成的。镇上的孩子都爱吃这家店的糖果，经常缠着父母给买上一整罐。' +
//             '将糖罐子放在床头，等到了晚上，罐子里的糖果就像天上的星星一样，会一闪一闪发出缤纷光亮。',
//     },
//     {
//         href: '#',
//         title: `ant design part 2`,
//         avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=2`,
//         description:
//             'Ant Design, a design language for background applications, is refined by Ant UED Team.',
//         content:
//             'We supply a series of (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
//     },
//     {
//         href: '#',
//         title: `ant design part 3`,
//         avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=3`,
//         description:
//             'Ant Design, a design language for background applications, is refined by Ant UED Team.',
//         content:
//             'We supply a series of (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
//     },
//     {
//         href: '#',
//         title: `ant design part 4`,
//         avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=4`,
//         description:
//             'Ant Design, a design language for background applications, is refined by Ant UED Team.',
//         content:
//             'We supply a series of (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
//     }
// ]

// export const blogGroup1 = [
//     {
//         key: 1,
//         name: 'Linux',
//         platform: 'Kubernetes',
//         version: '10.3.4.5654',
//         upgradeNum: 500,
//         creator: 'Qingfei fu',
//         createdAt: '2014-12-24 23:12:00',
//     },
//     {
//         key: 2,
//         name: 'Network',
//         platform: 'Kubernetes',
//         version: '10.3.4.5654',
//         upgradeNum: 500,
//         creator: 'Qingfei fu',
//         createdAt: '2014-12-24 23:12:00',
//     },
//     {
//         key: 3,
//         name: 'Database',
//         platform: 'Kubernetes',
//         version: '10.3.4.5654',
//         upgradeNum: 500,
//         creator: 'Qingfei fu',
//         createdAt: '2014-12-24 23:12:00',
//     },
// ]

// export const subTables = [
//     [
//         {
//             key: 1,
//             date: '2024-01-11 23:12:00',
//             name: 'Linux基础',
//             upgradeNum: '21',
//         },
//         {
//             key: 2,
//             date: '2024-01-12 23:12:00',
//             name: 'iptables详解',
//             upgradeNum: '63',
//         },
//         {
//             key: 3,
//             date: '2014-12-24 23:12:00',
//             name: '磁盘raid阵列详解',
//             upgradeNum: '56',
//         },
//     ],
//     [
//         {
//             key: 1,
//             date: '2024-01-11 23:12:00',
//             name: '常见的网络攻击',
//             upgradeNum: '36',
//         },
//         {
//             key: 2,
//             date: '2024-01-12 23:12:00',
//             name: 'TCP拥塞控制算法',
//             upgradeNum: '54',
//         },
//         {
//             key: 3,
//             date: '2014-12-24 23:12:00',
//             name: 'kubernetes三层网络方案',
//             upgradeNum: '23',
//         },
//     ],
//     [
//         {
//             key: 1,
//             date: '2024-01-11 23:12:00',
//             name: 'redis为什么快？',
//             upgradeNum: '54',
//         },
//         {
//             key: 2,
//             date: '2024-01-12 23:12:00',
//             name: 'SQL的执行流程',
//             upgradeNum: '86',
//         },
//     ]
// ]


export const options = [
    {
        label: 'Linux',
        value: 'Linux',
    },
    {
        label: 'Network',
        value: 'Network',
    },
    {
        label: 'Database',
        value: 'Database',
    },
    {
        label: 'Kubernetes',
        value: 'Kubernetes',
    },
    {
        label: 'Docker',
        value: 'Docker',
    },
    {
        label: 'LoadBalancing',
        value: 'LoadBalancing',
    },
];