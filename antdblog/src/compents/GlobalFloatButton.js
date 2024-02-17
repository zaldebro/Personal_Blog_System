import React, {useState} from 'react';
import {CommentOutlined, HomeTwoTone} from '@ant-design/icons';
import {FloatButton, Drawer, Space, Button, Typography} from 'antd';

const { Title, Paragraph, Text, Link } = Typography;


export default function GlobalFloatButton(){

    const [open, setOpen] = useState([false, false]);
    const toggleDrawer = (idx, target) => {
        setOpen((p) => {
            p[idx] = target;
            return [...p];
        });
    };

   return (
       <>
           <FloatButton.Group
               trigger="hover"
               type="primary"
               style={{
                   left: "10%",
               }}
               icon={<HomeTwoTone />}
           >
               <FloatButton onClick={() => toggleDrawer(0, true)} tooltip={<div>站主简历</div>}/>
               <FloatButton onClick={() => toggleDrawer(1, true)} icon={<CommentOutlined />} tooltip={<div>前往GitHub</div>} />
           </FloatButton.Group>

           <Drawer
               title="站主简历"
               placement="right"
               size="large"
               onClose={() => toggleDrawer(0, false)}
               open={open[0]}
               extra={
                   <Space>
                       <Button onClick={() => toggleDrawer(0, false)}>Cancel</Button>
                       <Button type="primary" onClick={() => toggleDrawer(0, false)}>
                           OK
                       </Button>
                   </Space>
               }
           >

               <Typography>
                   <Title level={2}>傅庆飞</Title>
                   <Title level={3}>教育经历</Title>
                   <Text strong >江苏大学</Text>
                   <ul>
                       <li>
                           大一：GPA：3.45（排名：9/74），江苏大学学习优秀奖学金二等奖，江苏大学计算机学院三好学生
                       </li>
                       <li>
                           大二：GPA：3.59（排名：10/80），江苏大学学习优秀奖学金三等奖，江苏大学计算机学院三好学生
                       </li>
                   </ul>
                   <Title level={3}>技能/证书及其他</Title>
                   CET4（577），机动车驾驶证，CET6（457），华为ICT大赛云赛道省一等奖，RHCSA（286），RHCE （290）认证ID：230-225-237
                   <Title level={3}>实习经历</Title>
                   <Paragraph>
                       <Text strong>杭州安恒信息技术有限公司</Text> --
                       服务器资产管理CMDB   Python3 Shell JavaScript
                       <ul>
                           <li>
                               服务器资产管理页面，支持服务器资产的导入导出，支持字段的修改，支持资产自定义分组
                           </li>
                           <li>
                               对接钉钉服务器审批信息申请服务器地址，责任人等信息自动更新资产管理页面
                           </li>
                           <li>
                               服务器到期使用提醒，并对到期的机器做操作，比如关闭docker修改密码，通知的方式使用钉钉单聊的方式
                           </li>
                           <li>
                               允许在web界面对服务器执行shell命令；当资产中的主机IP地址发生变化时，自动更新IP地址等信息
                           </li>
                       </ul>
                   </Paragraph>
                   <Title level={3}>项目经历</Title>
                   <Paragraph>
                       <Text strong>个人博客系统(本站)</Text>
                       <ul>
                           <li>
                               使用React框架和Antd组件构建前端页面，支持博客的增删改查和博客组管理等操作，支持服务器Prometheus监控项大屏，使用axios访问后端接口
                           </li>
                           <li>
                               使用Gin框架提供访问接口并且对MongoDB数据进行相关操作；同时使用Prometheus模块编写监控自定义参数项，当发生异常时，使用QQ邮件进行告警；使用Redis对博客的分组进行管理
                           </li>
                           <li>
                               将上述功能分别构建Docker镜像并推送到本地Harbor仓库中，使用Deployment部署，Service暴露服务
                           </li>
                           <li>
                               使用Stateful管理MongoDB副本集存储相关数据，使用StorageClass(NFS)进行持久化存储数据
                           </li>
                       </ul>
                   </Paragraph>
                   <Title level={3}>专业技能</Title>
                   <Paragraph>
                       <ul>
                           <li>
                               Linux基本命令、用户和磁盘，RAID阵列，LVM管理
                           </li>
                           <li>
                               熟悉NGINX，HAProxy负载均衡以及LVS的工作模式，常见负载均衡算法和高可用Keepalived
                           </li>
                           <li>
                               熟悉Linux操作系统，能够进行一定的性能分析和优化
                           </li>
                           <li>
                               熟悉DNS、ARP，NAT、DHCP等常见网络协议，对TCP协议有一定理解
                           </li>
                           <li>
                               熟悉Docker的使用，能够编写Dockerfile和docker-compose完成服务的部署
                           </li>
                           <li>
                               熟悉Prometheus架构，基本数据模型；能够编写简单的demo监控相关指标并且配置告警
                           </li>
                           <li>
                               熟悉Kubernetes的基本架构，Pod对象和Pod控制器，Local PV，Flannel和默认调度等
                           </li>
                           <li>
                               熟悉MySQL基本架构，MVCC，索引，锁，日志，存储引擎，主从复制等
                           </li>
                           <li>
                               熟悉Redis常见数据类型，持久化，主从复制，哨兵等
                           </li>
                           <li>
                               熟悉Python的基本数据类型，常见模块，垃圾回收机制和Flask框架，能够进一定的开发
                           </li>
                           <li>
                               能够使用React和Antd完成基本的前端开发，了解React Hooks
                           </li>
                           <li>
                               能够使用SHELL和Ansible编写脚本完成服务的自动化部署
                           </li>
                       </ul>
                   </Paragraph>
                   <Title level={3}>个人总结</Title>
                   <Paragraph>
                       <ul>
                           <li>
                               喜欢阅读技术相关的书籍和博客，例如：《计算机网络》，《MySQL是怎样运行的：从根上理解MySQL》，《深入剖析 kubernetes》，《Linux性能优化实战》等
                           </li>
                           <li>
                               积极向上，乐观开朗，踏实认真，有良好的身体素质，能够适应高强度工作
                           </li>
                       </ul>
                   </Paragraph>

               </Typography>
           </Drawer>

           <Drawer
               title="Github"
               placement="right"
               size="default"
               onClose={() => toggleDrawer(1, false)}
               open={open[1]}
               extra={
                   <Space>
                       <Button onClick={() => toggleDrawer(1, false)}>Cancel</Button>
                       <Button type="primary" onClick={() => toggleDrawer(1, false)}>
                           OK
                       </Button>
                   </Space>
               }
           >
               <p>点击此链接前往CMDB项目源码：</p>
               <a href="https://github.com/zaldebro/CMDB" target="_blank">前往CMDB项目</a>
               <p>点击此链接前往本站项目源码：</p>
               <a href="https://github.com/zaldebro/Personal_blog_system" target="_blank">前往本站项目</a>
           </Drawer>

       </>
   )
};
