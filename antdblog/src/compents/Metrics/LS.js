import React, {useEffect, useState} from 'react';
import ReactEcharts from "echarts-for-react";
import axios from "axios";
import {Flex, Spin, Button, Col, Row, Statistic} from "antd";

export default function LS() {
    const [monMeInfo, setMonMeInfo] = useState()

    const fetchData = async () => {
        try {
            const response = await axios.get('/LS/showLS')
            const tmpMonMeInfo = response.data.monMetrics
            setMonMeInfo(tmpMonMeInfo)
        } catch (error){
            console.log("error: ", error)
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            fetchData();
        }, 3000);
        return () => clearInterval(interval);
    }, [])

    return (
        <>
            <a href="#">点击前往Grafana</a>
            { monMeInfo ? (
                ( <>
                    {/*负载*/}
                    <div style={{ display: 'flex'}}>
                        <ReactEcharts
                            style={{
                                width: "25%"
                            }}
                            option={{
                                title: {
                                    text: '负载变化情况'
                                },
                                tooltip: {
                                    trigger: 'axis'
                                },
                                legend: {
                                    data: ['load_1', 'load_5', 'load_15']
                                },
                                grid: {
                                    left: '3%',
                                    right: '4%',
                                    bottom: '3%',
                                    containLabel: true
                                },
                                toolbox: {
                                    feature: {
                                        saveAsImage: {}
                                    }
                                },
                                xAxis: {
                                    type: 'category',
                                    boundaryGap: false,
                                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                                },
                                yAxis: {
                                    type: 'value'
                                },
                                series: [
                                    {
                                        name: 'load_1',
                                        type: 'line',
                                        data: monMeInfo.load_me_list.load_1
                                    },
                                    {
                                        name: 'load_5',
                                        type: 'line',
                                        data: monMeInfo.load_me_list.load_5
                                    },
                                    {
                                        name: 'load_15',
                                        type: 'line',
                                        data: monMeInfo.load_me_list.load_15
                                    },
                                ]
                            }} />

                        <ReactEcharts
                            style={{
                                width: "25%"
                            }}
                            option={ {
                                tooltip: {
                                    formatter: '{a} <br/>{b} : {c}%',
                                },
                                series: [
                                    {
                                        name: 'Unit: %',
                                        // name: 'Pressure',
                                        type: 'gauge',
                                        progress: {
                                            show: true
                                        },
                                        detail: {
                                            valueAnimation: true,
                                            formatter: '{value}',
                                            textStyle: { // 设置detail的字体样式
                                                fontSize: 12, // 设置字体大小为18px
                                            }
                                        },
                                        data: [
                                            {
                                                value: `${Number(monMeInfo.usage_me.cpusage).toFixed(2)}`, // 替换为模板字符串
                                                name: 'CPU usage',
                                            }
                                        ],
                                    }
                                ]
                            }} />
                        <ReactEcharts
                            style={{
                                width: "25%"
                            }}
                            option={{
                                tooltip: {
                                    formatter: '{a} <br/>{b} : {c}%',
                                },
                                series: [
                                    {
                                        name: 'Unit: %',
                                        type: 'gauge',
                                        progress: {
                                            show: true
                                        },
                                        detail: {
                                            valueAnimation: true,
                                            formatter: '{value}',
                                            textStyle: { // 设置detail的字体样式
                                                fontSize: 12, // 设置字体大小为18px
                                            }
                                        },
                                        data: [
                                            {
                                                value: `${Number(monMeInfo.usage_me.memusage).toFixed(2)}`,
                                                name: 'MEM usage',
                                            }
                                        ]
                                    }
                                ]
                            }} />

                        <ReactEcharts
                            style={{
                                width: "25%"
                            }}
                            option={{
                                tooltip: {
                                    formatter: '{a} <br/>{b} : {c}%',
                                },
                                series: [
                                    {
                                        name: 'Unit: %',
                                        type: 'gauge',
                                        progress: {
                                            show: true
                                        },
                                        detail: {
                                            valueAnimation: true,
                                            formatter: '{value}',
                                            textStyle: { // 设置detail的字体样式
                                                fontSize: 12, // 设置字体大小为18px
                                            }
                                        },
                                        data: [
                                            {
                                                value: `${Number(monMeInfo.usage_me.swapusage).toFixed(2)}`,
                                                name: 'SWAP usage'
                                            }
                                        ]
                                    }
                                ]
                            }} />
                    </div>


                    {/*饼图，使用情况*/}
                    <div style={{display: "flex"}}>
                        <ReactEcharts style={{width: '50%'}}
                                      option={{
                                          title: {
                                              text: 'Memory usage',
                                              subtext: '(MB)',
                                              left: 'center'
                                          },
                                          tooltip: {
                                              trigger: 'item'
                                          },
                                          legend: {
                                              orient: 'vertical',
                                              left: 'left'
                                          },
                                          series: [
                                              {
                                                  name: 'Access From',
                                                  type: 'pie',
                                                  radius: '50%',
                                                  data: [
                                                      { value: Number(monMeInfo.mem_me.total).toFixed(2), name: 'Total' },
                                                      { value: Number(monMeInfo.mem_me.available).toFixed(2), name: 'Available' },
                                                      { value: Number(monMeInfo.mem_me.used).toFixed(2), name: 'Used' },
                                                      { value: Number(monMeInfo.mem_me.free).toFixed(2), name: 'Free' },
                                                      { value: Number(monMeInfo.mem_me.buffers).toFixed(2), name: 'Buffers' },
                                                      { value: Number(monMeInfo.mem_me.cached).toFixed(2), name: 'Cached' },
                                                  ],
                                                  emphasis: {
                                                      itemStyle: {
                                                          shadowBlur: 10,
                                                          shadowOffsetX: 0,
                                                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                                                      }
                                                  }
                                              }
                                          ]
                                      }} />
                        <ReactEcharts style={{width: '50%'}}
                                      option={{
                                          title: {
                                              text: 'SWAP usage',
                                              subtext: '(MB)',
                                              left: 'center'
                                          },
                                          tooltip: {
                                              trigger: 'item'
                                          },
                                          legend: {
                                              orient: 'vertical',
                                              left: 'left'
                                          },
                                          series: [
                                              {
                                                  name: 'Access From',
                                                  type: 'pie',
                                                  radius: '50%',
                                                  data: [
                                                      { value: Number(monMeInfo.mem_me.swap_total).toFixed(2), name: 'Total' },
                                                      { value: Number(monMeInfo.mem_me.swap_used).toFixed(2), name: 'Available' },
                                                      { value: Number(monMeInfo.mem_me.swap_free).toFixed(2), name: 'Free' },
                                                  ],
                                                  emphasis: {
                                                      itemStyle: {
                                                          shadowBlur: 10,
                                                          shadowOffsetX: 0,
                                                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                                                      }
                                                  }
                                              }
                                          ]
                                      }} />
                    </div>


                    {/*使用率*/}
                    <ReactEcharts option={{
                        title: {
                            text: '相关使用率变化折线图'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['CPU', 'MEM', 'SWAP']
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        toolbox: {
                            feature: {
                                saveAsImage: {}
                            }
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [
                            {
                                name: 'CPU',
                                type: 'line',
                                data: monMeInfo.tmpusage_me_list.cpusage
                            },
                            {
                                name: 'MEM',
                                type: 'line',
                                data: monMeInfo.tmpusage_me_list.memusage
                            },
                            {
                                name: 'SWAP',
                                type: 'line',
                                data: monMeInfo.tmpusage_me_list.swapusage
                            },
                        ]
                    }} />


                    {/* I/O情况*/}
                    {monMeInfo.disk_me.map(item => {
                        return <>
                            <Row gutter={10}>
                                <Col span={3}>
                                    <Statistic title="read_count" value={item.read_count} />
                                </Col>
                                <Col span={3}>
                                    <Statistic title="merged_read_count" value={item.merged_read_count} precision={2} />
                                </Col>
                                <Col span={3}>
                                    <Statistic title="rread_bytes" value={item.rread_bytes} precision={2} />
                                </Col>

                                <Col span={3}>
                                    <Statistic title={'磁盘：' + item.name} value={112893} loading />
                                </Col>

                                <Col span={3}>
                                    <Statistic title="write_count" value={item.write_count} precision={2} />
                                </Col>

                                <Col span={3}>
                                    <Statistic title="merged_write_count" value={item.merged_write_count} precision={2} />
                                </Col>

                                <Col span={3}>
                                    <Statistic title="write_bytes" value={item.write_bytes} precision={2} />
                                </Col>
                            </Row>
                        </>
                    })}

                    {/*网络情况*/}
                    <ReactEcharts
                        style={{
                            width: "100%"
                        }}
                        option={{
                            title: {
                                text: '网络变化情况'
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: ['bytes_sent', 'bytes_recv', 'packets_sent', 'packets_recv', 'errin', 'errout', 'dropin', 'dropout']
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            toolbox: {
                                feature: {
                                    saveAsImage: {}
                                }
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: [
                                {
                                    name: 'bytes_sent',
                                    type: 'line',
                                    data: monMeInfo.net_metric_list.bytes_sent
                                },
                                {
                                    name: 'bytes_recv',
                                    type: 'line',
                                    data: monMeInfo.net_metric_list.bytes_recv
                                },
                                {
                                    name: 'packets_sent',
                                    type: 'line',
                                    data: monMeInfo.net_metric_list.packets_sent
                                },
                                {
                                    name: 'packets_recv',
                                    type: 'line',
                                    data: monMeInfo.net_metric_list.packets_recv
                                },
                                {
                                    name: 'errin',
                                    type: 'line',
                                    data: monMeInfo.net_metric_list.errin
                                },
                                {
                                    name: 'errout',
                                    type: 'line',
                                    data: monMeInfo.net_metric_list.errout
                                },
                                {
                                    name: 'dropin',
                                    type: 'line',
                                    data: monMeInfo.net_metric_list.dropin
                                },
                                {
                                    name: 'dropout',
                                    type: 'line',
                                    data: monMeInfo.net_metric_list.dropout
                                },
                            ]
                        }}/>

                </>)
            ) : (
                <Flex gap="large" vertical>
                    <Spin tip="加载较慢，请耐心等待！" size="large">
                        <div className="content" />
                    </Spin>
                </Flex>
            )}

        </>

    );
}
