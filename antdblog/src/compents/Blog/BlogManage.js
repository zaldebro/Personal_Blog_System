import React, {useEffect, useState} from 'react';
import { Badge, Space, Table, message, Button, Drawer, Checkbox, Divider, Form, Input } from 'antd';
import axios from "axios";
import {useNavigate} from "react-router-dom";

export function BlogManage() {

    const navigate = useNavigate();
    const [blogGroup, setBlogGroup] = useState()
    const fetchData = async () => {
        try {
            const response = await axios.get('/group/getGroupData')
            const groupList = response.data.blogGrInList
            const tmpgroupTaDaList = [];
            for (let index = 0; index < groupList.length; index++) {
                const group = groupList[index];
                const tmpGroup = {
                    key: index,
                    name: group.name,
                    platform: group.platform,
                    version: group.version,
                    upgradeNum: group.upgrade_num,
                    creator: group.creator,
                    createdAt: group.created_at,
                    members: group.blog_me_in_list
                };
                tmpgroupTaDaList.push(tmpGroup);
            }
            setBlogGroup(tmpgroupTaDaList)
        } catch (error){
            console.log("error: ", error)
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const [messageApi, contextHolder] = message.useMessage();

    const warning = (type, content) => {
        messageApi.open({
            type: type,
            content: content,
        });
    }

    const [checkedList, setCheckedList] = useState([]);

    const onChange = (list) => {
        setCheckedList(list);
    };

    // 博客组名称 The name of the blog group
    const [blogGrNa, setBlogGrNa] = useState();
    // 设置博客分组flag，用于标记是添加到分组还是删除分组，flag为true删除博客成员，为false增加博客成员
    const [blogGrFlag, setBlogGrFlag]= useState(false);
    const [open, setOpen] = useState(false);
    const [titleList, setTitleList] = useState([])
    const getTiList = async () => {
        try {
            const response = await axios.get("/group/getAlBlTi");
            const tmptitleList = response.data.listofblogTi;
            const listofblogTi = tmptitleList.map((item) => item.Title);
            setTitleList(listofblogTi)
        }catch (error){
            console.log("获取博客标题列表失败！", error)
        }
    }
    const showDrawer = (record, flag) => {
        setBlogGrNa(record.name);
        setBlogGrFlag(flag)
        if (flag  && record.members ){
            const listofblogTi = record.members.map((item) => item.title);
            setTitleList(listofblogTi)
        } else {
            getTiList();
        }
        setOpen(true);
    };
    const onClose = () => {
        setCheckedList([]);
        setOpen(false);
    };
    // 添加博客组博客 Add a blog group blog
    const modBlGrBl = () => {
        if (blogGrFlag){
            // 移除博客
            axios.post("/group/delGroupMe", {
                "groupname": blogGrNa,
                "checkedlist" : checkedList
            })
                .then(function (response){
                    setCheckedList([])
                    onClose()
                    warning("success", "移除博客成员成功！")
                    fetchData();
                })
                .catch(function (error){
                    warning("error", "移除博客成员失败！")
                    console.log("移除组成员失败！", error)
                })
        } else {
            axios.post("/group/addGroupMe", {
                "groupname": blogGrNa,
                "checkedlist" : checkedList
            })
                .then(function (response){
                    setCheckedList([])
                    onClose()
                    warning("success", "添加博客成员成功！")
                    fetchData();
                })
                .catch(function (error){
                    warning("error", "添加博客成员失败！")
                    console.log("添加组成员失败！", error)
                })
        }
    }

    // 删除博客组博客 Delete a blog group blog
    const delBlGrBl = (title) => {
        axios.post("/blog/delBLog", {
            "title": title
        })
            .then(function (response){
                setCheckedList([])
                onClose()
                warning("success", "删除博客成功！")
                fetchData();
            })
            .catch(function (error){
                warning("error", "删除博客失败！")
            })
    }

    const expandedRowRender = (record) => {
        const columns = [
            {
                title: '创建日期',
                dataIndex: 'date',
                key: 'date',
            },
            {
                title: '博客名称',
                dataIndex: 'title',
                key: 'title',
            },
            {
                title: '状态',
                key: 'state',
                render: () => <Badge status="success" text="Finished" />,
            },
            {
                title: '拥有标签',
                dataIndex: 'tags',
                key: 'tags',
                render: (record, data) => (
                    <Space size="small">
                        {data.tags}
                    </Space>
                ),
            },
            {
                title: 'Action',
                dataIndex: 'operation',
                key: 'operation',
                render: (record, data) => (
                    <Space size="middle">
                        <a onClick={ ()=> {navigate("/blog/Info/" + data.id.toString())} }> 查看 </a>
                        <a onClick={ () => { warning("warning", "没有权限！") } }> 编辑 </a>
                        <a onClick={ () => { delBlGrBl(data.title) } }> 删除 </a>
                    </Space>
                ),
            },
        ];

        const data = blogGroup[record.key].members;

        return <Table columns={columns} dataSource={data} pagination={false} />;
    };

    const columns = [
        {
            title: '分组名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '当前部署平台',
            dataIndex: 'platform',
            key: 'platform',
        },
        {
            title: '版本',
            dataIndex: 'version',
            key: 'version',
        },
        {
            title: '更新次数',
            dataIndex: 'upgradeNum',
            key: 'upgradeNum',
        },
        {
            title: '创建者',
            dataIndex: 'creator',
            key: 'creator',
        },
        {
            title: '创建日期',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Action',
            key: 'operation',
            render: (record, data) => (
                <Space size="middle">
                    <a onClick={() => showDrawer(record, false)} > 添加博客 </a>
                    <a onClick={() => showDrawer(record, true)} > 移除博客 </a>
                    {/*<a onClick={ () => { delBlGrBl(data.title) } }> 删除 </a>*/}
                </Space>
            ),
        },
    ];

    const [groupOpen, setGroupOpen] = useState(false)
    const [groupFlag, setGroupFlag] = useState(false)
    const [grList, setGrList] = useState([])
    const [checkedGr, setCheckedGr] = useState([])

    const getGrList = async () => {
        try {
            const response = await axios.get("/group/getAlGrNa");
            const tmpGrList = response.data.listofGrNa;
            console.log("tmpGrList: ", tmpGrList)
            setGrList(tmpGrList)
            // const listofblogTi = tmptitleList.map((item) => item.Title);
            // setTitleList(listofblogTi)
        }catch (error){
            console.log("获取博客标题列表失败！", error)
        }
    }

    const showGrDrawer = (flag) => {
        setGroupFlag(flag)
        if (!flag){
            getGrList()
        }
        setGroupOpen(true)
    }

    const onGrChange = (list) => {
        setCheckedGr(list)
    }

    const onGrClose = () => {
        setCheckedGr()
        setGroupOpen(false)
    }
    const onFinish = (values) => {
        axios.post("/group/addGroup", {
            "name" : values.name,
            "platform" : values.platform,
            "version": values.version,
            "upgrade_num" : values.upgradeNum,
            "creator" : values.creator,
        })
            .then((response)=>{
                fetchData();
                warning("success", "新增分组成功！")
            })
            .catch((error)=>{
                warning("error", "新增分组失败！")
            })
        onGrClose();
    };

    const delGroup = () => {
        axios.post("/group/delGroup", {
            "del_group_li" : checkedGr
        })
            .then(function (response){
                fetchData();
                warning("success", "删除分组成功！")
            })
            .catch(function (err){
                warning("success", "删除分组失败！")
            })
        onGrClose()
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            {contextHolder}
            <div  style={{
                float: "left",
            }}>
                <Button type="text" onClick={() => showGrDrawer(true)}>
                    新增分组
                </Button>
                <Button danger type="text" onClick={() => showGrDrawer(false)}>
                    删除分组
                </Button>
            </div>
            <br/>
            <br/>

            <Table
                columns={columns}
                expandable={{
                    expandedRowRender: (record) => expandedRowRender(record),
                    defaultExpandedRowKeys: [0],
                }}
                dataSource={blogGroup}
                size="large"
            />

            <Drawer title={groupFlag ? <span>新增分组</span> : <span>删除分组</span>} onClose={onGrClose} open={groupOpen}>
                {groupFlag ?
                    <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="分组名称"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input name!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="当前部署平台"
                        name="platform"
                        rules={[
                            {
                                required: true,
                                message: 'Please input username!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="版本"
                        name="version"
                        rules={[
                            {
                                required: true,
                                message: 'Please input version!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="更新次数"
                        name="upgradeNum"
                        rules={[
                            {
                                required: true,
                                message: 'Please input upgradeNum!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="创建者"
                        name="creator"
                        rules={[
                            {
                                required: true,
                                message: 'Please input creator!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form> :
                    <>
                        <Checkbox.Group
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                margin: "3px"
                            }}
                            options={grList}
                            value={checkedGr}
                            onChange={onGrChange}
                        />
                        <Button type="primary" htmlType="submit" onClick={delGroup}>
                            Submit
                        </Button>
                    </>}
            </Drawer>

            <Drawer
                    title={'当前分组：' + blogGrNa}
                    onClose={onClose}
                    open={open}
                    size="default"
                    extra={
                        <Space>
                            <Button onClick={onClose}>取消</Button>
                            <Button type="primary" onClick={modBlGrBl}>确认</Button>
                        </Space>
                    }>

                {blogGrFlag ? <h3>请选择要移除的博客</h3> : <h3>请选择要添加的博客</h3>}

                <Divider />
                <Checkbox.Group
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        margin: "3px"
                    }}
                    options={titleList}
                    value={checkedList}
                    onChange={onChange} />
            </Drawer>

        </>
    );
}
