package main

import (
	"flag"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/shirou/gopsutil/cpu"
	"github.com/shirou/gopsutil/disk"
	"github.com/shirou/gopsutil/host"
	"github.com/shirou/gopsutil/mem"
	"github.com/shirou/gopsutil/net"
	ipnet "net"
	"strconv"
	"sync"
	"time"
)

// Metrics 定义指标结构体
type Metrics struct {
	metrics map[string]*prometheus.Desc
	mutex sync.Mutex
}

// 创建指标描述符, 上面的第一行
func newGlobalMetric(namespace string, metricName string, docString string, labels []string) *prometheus.Desc {
	return prometheus.NewDesc(namespace+"_"+metricName, docString, labels, nil)
}


// 初始化指标信息，即 Metrics 结构体
func newMetrics(namespace string) *Metrics {
	return &Metrics{
		metrics: map[string]*prometheus.Desc{
			"counter_metric": newGlobalMetric(namespace, "server_A_Name","The description of my_counter_metric",[]string{"name"}),
			"ip_metric": newGlobalMetric(namespace, "IP_related","The description of my_ip_metric",[]string{"ip"}),
			"gauge_metric": newGlobalMetric(namespace, "Network_related","The description of my_gauge_metric", []string{"name"}),
			"cpu_metric": newGlobalMetric(namespace, "CPU_related","The description of my_cpu_metric", []string{"name"}),
			"disk_metric": newGlobalMetric(namespace, "Disk_dependent","The description of my_disk_metric", []string{"name"}),
			"mem_metric": newGlobalMetric(namespace, "Memor_dependent","The description of my_mem_metric", []string{"name"}),
		},
	}
}


// Describe 创建接口 传递结构体中的指标描述符到channel
func (c *Metrics) Describe (ch chan <- *prometheus.Desc){
	for _, m := range c.metrics{
		ch <- m
	}
}

// GenerateMockData 生成模拟数据
func (c *Metrics) GenerateMockData() (mockCounterMetricData map[string]float64, mockGaugeMetricData map[string]float64, mockCpuMetricData map[string]float64, mockDiskMetricData map[string]float64, mockMemMetricData map[string]float64, mockIpMetricData map[string]float64){
	// 监控宿主机指标
	mHost, _ := host.Info()
	fmt.Println("mHost -> ", mHost)
	mockCounterMetricData = map[string]float64{
		"Host Hostname: " + mHost.Hostname: 0,
		"Host OS: " + mHost.OS:       0,
		"Host upTime: ": float64(mHost.Uptime),
		"Host Platform: " + mHost.Platform: 0,
	}

	// IP信息
	ip := getLocalIP()
	mockIpMetricData = map[string]float64{
		"IP: " + ip:0,
	}
	// 监控CPU相关
	mCPU,_ := cpu.Info()
	mCpuUse, _ := cpu.Percent(time.Second, true)

	mockCpuMetricData = map[string]float64{}
	for idx, mcpu := range mCPU{
		mcpu_idx := strconv.Itoa(idx)
		mockCpuMetricData["CPU_idx_" + mcpu_idx] = float64(mcpu.CPU)
		mockCpuMetricData["CPU_Mhz_" + mcpu_idx] = float64(mcpu.Mhz)
		mockCpuMetricData["CPU_CacheSize_" + mcpu_idx] = float64(mcpu.CacheSize)
		mockCpuMetricData["CPU_Family_" + mcpu.Family + mcpu_idx] = 0
		mockCpuMetricData["CPU_ModelName_" + mcpu.ModelName + mcpu_idx] = 0
		mockCpuMetricData["CPU_Cores_" + mcpu_idx] = float64(mcpu.Cores)
		mockCpuMetricData["Cpu_Usage(%)_" + mcpu_idx] = mCpuUse[idx]
	}

	// 监控磁盘相关
	mDisk, _ := disk.Usage("/")
	mockDiskMetricData = map[string]float64{
		"Disk Path: " + mDisk.Path:   0,
		"Disk Fstype: " + mDisk.Fstype: 0,
		"Disk Total(GB)":             float64(mDisk.Total/1024/1024/1024),
		"Disk Free(GB)":              float64(mDisk.Free/1024/1024/1024),
		"Disk Used(GB)":              float64(mDisk.Used/1024/1024/1024),
		"Disk Usage(%)":              mDisk.UsedPercent,
		"Disk InodesTotal(GB)":       float64(mDisk.InodesTotal),
		"Disk InodesUsed(GB)":        float64(mDisk.InodesUsed),
		"Disk InodesFree(GB)": 		  float64(mDisk.InodesFree),
		"Disk InodesUsedPercent(GB)": mDisk.InodesUsedPercent,
	}
	// 监控内存相关
	mMem, _ := mem.VirtualMemory()
	mockMemMetricData = map[string]float64{
		"Mem Total(MB)": float64(mMem.Total/1024/1024),
		"Mem Free(MB)":  float64(mMem.Available/1024/1024),
		"Mem Used(MB)":  float64(mMem.Used/1024/1024),
		"Mem Usage(%)":  mMem.UsedPercent,
		"Mem Active(MB)" : float64(mMem.Active/1024/1024),
		"Mem Inactive(MB)" : float64(mMem.Inactive/1024/1024),
		"Mem Buffers(MB)" : float64(mMem.Buffers/1024/1024),
		"Mem Cached(MB)" : float64(mMem.Cached/1024/1024),
		"Mem Dirty(MB)" : float64(mMem.Dirty/1024/1024),
		"Mem Shared(MB)" : float64(mMem.Shared/1024/1024),
		"Mem Slab(MB)" : float64(mMem.Slab/1024/1024),
		"Mem SwapTotal(MB)" : float64(mMem.SwapTotal/1024/1024),
		"Mem SwapFree(MB)" : float64(mMem.SwapFree/1024/1024),
	}

	// 监控网络相关
	mNetwork, _ := net.IOCounters(true)
	mockGaugeMetricData = map[string]float64{}
	for _,card := range mNetwork {
		mockGaugeMetricData[card.Name + "-Bytes Recv(bytes)" ] = float64(card.BytesRecv)
		mockGaugeMetricData[card.Name + "-Bytes Sent(bytes)"] = float64(card.BytesSent)
		mockGaugeMetricData[card.Name + "-PacketsRecv"] = float64(card.PacketsRecv)
		mockGaugeMetricData[card.Name + "-PacketsSent"] = float64(card.PacketsSent)
		mockGaugeMetricData[card.Name + "-Errin"] = float64(card.Errin)
		mockGaugeMetricData[card.Name + "-Errout"] = float64(card.Errout)
		mockGaugeMetricData[card.Name + "-Dropin"] = float64(card.Dropin)
		mockGaugeMetricData[card.Name + "-Dropout"] = float64(card.Dropout)
	}
	return
}

// Collect 创建接口，抓取最新的数据传递给 channel，重写父类的 Collect ？
func (c *Metrics) Collect (ch chan <- prometheus.Metric) {
	c.mutex.Lock()
	defer c.mutex.Unlock()

	mockCounterMetricData, mockGaugeMetricData, mockCpuMetricData, mockDiskMetricData, mockMemMetricData, mockIpMetricData := c.GenerateMockData()
	for name, currentValue := range mockCounterMetricData {
		ch <-prometheus.MustNewConstMetric(c.metrics["counter_metric"], prometheus.CounterValue,float64(currentValue),name)
	}
	for name, currentValue := range mockGaugeMetricData {
		ch <-prometheus.MustNewConstMetric(c.metrics["gauge_metric"], prometheus.GaugeValue,float64(currentValue),name)
	}
	for name, currentValue := range mockCpuMetricData {
		ch <-prometheus.MustNewConstMetric(c.metrics["cpu_metric"], prometheus.GaugeValue,float64(currentValue),name)
	}
	for name, currentValue := range mockDiskMetricData {
		ch <-prometheus.MustNewConstMetric(c.metrics["disk_metric"], prometheus.GaugeValue,float64(currentValue),name)
	}
	for name, currentValue := range mockMemMetricData {
		ch <-prometheus.MustNewConstMetric(c.metrics["mem_metric"], prometheus.GaugeValue,float64(currentValue),name)
	}
	for name, currentValue := range mockIpMetricData {
		ch <-prometheus.MustNewConstMetric(c.metrics["ip_metric"], prometheus.CounterValue,float64(currentValue),name)
	}
}

// 获取本机IP
func getLocalIP() string {
	conn, err := ipnet.Dial("udp", "8.8.8.88:80")
	if err != nil {
		fmt.Println(err)
	}
	defer conn.Close()
	loclAddr := conn.LocalAddr().(*ipnet.UDPAddr)
	return loclAddr.IP.String()
}

var (
	metricsNamespace = flag.String("metric.namespace", "Blog", "Prometheus metrics namespace, as the prefix of metrics name")
)

func registerMetricsRoute(router *gin.Engine) {
	flag.Parse()
	metrics := newMetrics(*metricsNamespace)
	registry := prometheus.NewRegistry()
	registry.MustRegister(metrics)

	metricsRoute := router.Group("/metrics")
	{
		metricsRoute.GET("/show", gin.WrapH(promhttp.HandlerFor(registry, promhttp.HandlerOpts{})))
	}
}