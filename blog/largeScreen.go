package main

import (
	"github.com/gin-gonic/gin"
	"github.com/shirou/gopsutil/cpu"
	"github.com/shirou/gopsutil/disk"
	"github.com/shirou/gopsutil/host"
	"github.com/shirou/gopsutil/load"
	"github.com/shirou/gopsutil/mem"
	"github.com/shirou/gopsutil/net"
	"net/http"
	"sort"
	"time"
)

// 使用率（总）： CPU、内存、SWAP、磁盘
type usageMetrics struct {
	Cpusage float64 `json:"cpusage"`
	Memusage float64 `json:"memusage"`
	Swapusage float64 `json:"swapusage"`
}
type UsageMeList = struct{
	Cpusage []float64 `json:"cpusage"`
	Memusage []float64 `json:"memusage"`
	Swapusage []float64 `json:"swapusage"`
}
var tmpusageMeList UsageMeList

// 负载信息
type loadMetrics struct {
	Load1 float64 `json:"load_1"`
	Load5 float64 `json:"load_5"`
	Load15 float64 `json:"load_15"`
}
type loadMetricsList struct {
	Load1 []float64 `json:"load_1"`
	Load5 []float64 `json:"load_5"`
	Load15 []float64 `json:"load_15"`
}
var tmpLoadMeList loadMetricsList

// 主机信息
type hostMetrics struct {
	Hostname string `json:"hostname"`
	Uptime float64 `json:"uptime"`
	BootTime float64 `json:"boot_time"`
	Os string `json:"os"`
	PlatformVersion string `json:"platform_version"`
	KernelVersion string `json:"kernel_version"`
}

// 网络信息
type netMetric struct {
	BytesSent float64 `json:"bytes_sent"`
	BytesRecv float64 `json:"bytes_recv"`
	PacketsSent float64 `json:"packets_sent"`
	PacketsRecv float64 `json:"packets_recv"`
	Errin float64 `json:"errin"`
	Errout float64 `json:"errout"`
	Dropin float64 `json:"dropin"`
	Dropout float64 `json:"dropout"`
}
type NetMetricList struct {
	BytesSent []float64 `json:"bytes_sent"`
	BytesRecv []float64 `json:"bytes_recv"`
	PacketsSent []float64 `json:"packets_sent"`
	PacketsRecv []float64 `json:"packets_recv"`
	Errin []float64 `json:"errin"`
	Errout []float64 `json:"errout"`
	Dropin []float64 `json:"dropin"`
	Dropout []float64 `json:"dropout"`
}
var tmpNetMetricList NetMetricList

// 内存信息
type memMetric struct {
	Total float64 `json:"total"`
	Available float64 `json:"available"`
	Used float64 `json:"used"`
	UsedPercent float64 `json:"used_percent"`
	Free float64 `json:"free"`
	Buffers float64 `json:"buffers"`
	Cached float64 `json:"cached"`
	SwapTotal float64 `json:"swap_total"`
	SwapUsed float64 `json:"swap_used"`
	SwapFree float64 `json:"swap_free"`
	SwapUsedPercent float64 `json:"swap_used_percent"`
}

// 磁盘信息，切片
type diskMetric struct {
	Name string `json:"name"`
	ReadCount float64 `json:"read_count"`
	MergedReadCount float64 `json:"merged_read_count"`
	WriteCount float64 `json:"write_count"`
	MergedWriteCount float64 `json:"merged_write_count"`
	RreadBytes float64 `json:"rread_bytes"`
	WriteBytes float64 `json:"write_bytes"`
	ReadTime float64 `json:"read_time"`
	WriteTime float64 `json:"write_time"`
}

// Monitoring metrics
type monMetrics struct {
	LoadMeList loadMetricsList `json:"load_me_list"`
	UsageMe usageMetrics `json:"usage_me"`
	HostMe hostMetrics `json:"host_me"`
	MemMe memMetric `json:"mem_me"`
	NetMetricList NetMetricList `json:"net_metric_list"`
	DiskMe []diskMetric `json:"disk_me"`
	UsageMeList UsageMeList `json:"tmpusage_me_list"`
}


func showLS(c *gin.Context) {
	hostInfo, _ := host.Info()
	var tmpHostMetrics = hostMetrics{
		Hostname :        hostInfo.Hostname,
		Uptime :          float64(hostInfo.Uptime),
		BootTime : 		  float64(hostInfo.BootTime),
		Os :              hostInfo.OS,
		PlatformVersion : hostInfo.PlatformVersion,
		KernelVersion :   hostInfo.KernelVersion,
	}

	MEMInfo, _ := mem.VirtualMemory()
	SWAPInfo, _ := mem.SwapMemory()
	var tmpMemMe = memMetric{
		Total :          float64(MEMInfo.Total/1024/1024),
		Available :      float64(MEMInfo.Available/1024/1024),
		Used :           float64(MEMInfo.Used/1024/1024),
		UsedPercent :    MEMInfo.UsedPercent,
		Free :           float64(MEMInfo.Free/1024/1024),
		Buffers :        float64(MEMInfo.Buffers/1024/1024),
		Cached :         float64(MEMInfo.Cached/1024/1024),
		SwapTotal :      float64(SWAPInfo.Total/1024/1024),
		SwapUsed:        float64(SWAPInfo.Used/1024/1024),
		SwapFree : 		 float64(SWAPInfo.Free/1024/1024),
		SwapUsedPercent: SWAPInfo.UsedPercent,
	}

	CPUse, _ := cpu.Percent(time.Second, false)
	var tmpusageMe = usageMetrics{
		Cpusage: CPUse[0],
		Memusage: tmpMemMe.UsedPercent,
		Swapusage: tmpMemMe.SwapUsedPercent,
	}

	ioStat, _ := disk.IOCounters()

	var tmpDiskMeSlice = []diskMetric{}

	for _, part := range ioStat {
		var tmpDiskMe = diskMetric{
			Name:              part.Name,
			ReadCount:         float64(part.ReadCount),
			MergedReadCount:   float64(part.MergedReadCount),
			WriteCount:        float64(part.WriteCount),
			MergedWriteCount:  float64(part.MergedWriteCount),
			RreadBytes:        float64(part.ReadBytes/1024),
			WriteBytes: 	   float64(part.WriteBytes),
			ReadTime:          float64(part.ReadTime),
			WriteTime:         float64(part.WriteTime),
		}
		tmpDiskMeSlice = append(tmpDiskMeSlice, tmpDiskMe)
	}

	sort.Slice(tmpDiskMeSlice, func(i, j int) bool {
		return tmpDiskMeSlice[i].Name < tmpDiskMeSlice[j].Name
	})

	var tmpMonMe = monMetrics{
		LoadMeList: tmpLoadMeList,
		UsageMe: tmpusageMe,
		HostMe: tmpHostMetrics,
		NetMetricList: tmpNetMetricList,
		MemMe: tmpMemMe,
		DiskMe: tmpDiskMeSlice,
		UsageMeList: tmpusageMeList,
	}
	c.JSON(http.StatusOK, gin.H{"monMetrics": tmpMonMe,"tmpusageMeList": tmpusageMeList})
}

type CollectUsDaReg struct {}

// Run 定时收集数据 Collect data regularly
func (c CollectUsDaReg) Run(){
	loadAvg, _ := load.Avg()
	var tmpLoadMe = loadMetrics{
		Load1: loadAvg.Load1,
		Load5: loadAvg.Load5,
		Load15: loadAvg.Load15,
	}
	tmpLoadMeList.Load1 = append(tmpLoadMeList.Load1, tmpLoadMe.Load1)
	tmpLoadMeList.Load5 = append(tmpLoadMeList.Load5, tmpLoadMe.Load5)
	tmpLoadMeList.Load15 = append(tmpLoadMeList.Load15, tmpLoadMe.Load15)


	MEMInfo, _ := mem.VirtualMemory()
	SWAPInfo, _ := mem.SwapMemory()
	var tmpMemMe = memMetric{
		Total :          float64(MEMInfo.Total/1024/1024),
		Available :      float64(MEMInfo.Available/1024/1024),
		Used :           float64(MEMInfo.Used/1024/1024),
		UsedPercent :    MEMInfo.UsedPercent,
		Free :           float64(MEMInfo.Free/1024/1024),
		Buffers :        float64(MEMInfo.Buffers/1024/1024),
		Cached :         float64(MEMInfo.Cached/1024/1024),
		SwapTotal :      float64(SWAPInfo.Total/1024/1024),
		SwapUsed:        float64(SWAPInfo.Used/1024/1024),
		SwapFree : 		 float64(SWAPInfo.Free/1024/1024),
		SwapUsedPercent: SWAPInfo.UsedPercent,
	}
	CPUse, _ := cpu.Percent(time.Second, false)
	var tmpusageMe = usageMetrics{
		Cpusage: CPUse[0],
		Memusage: tmpMemMe.UsedPercent,
		Swapusage: tmpMemMe.SwapUsedPercent,
	}
	tmpusageMeList.Cpusage = append(tmpusageMeList.Cpusage, tmpusageMe.Cpusage)
	tmpusageMeList.Memusage = append(tmpusageMeList.Memusage, tmpusageMe.Memusage)
	tmpusageMeList.Swapusage = append(tmpusageMeList.Swapusage, tmpusageMe.Swapusage)

	//tmpNetMetricList
	netInfo, _ := net.IOCounters(false)
	var tmpNetMetric = netMetric{
		BytesSent:   float64(netInfo[0].BytesSent/1024),
		BytesRecv:   float64(netInfo[0].BytesRecv/1024),
		PacketsSent: float64(netInfo[0].PacketsSent),
		PacketsRecv: float64(netInfo[0].PacketsRecv),
		Errin:       float64(netInfo[0].Errin),
		Errout:      float64(netInfo[0].Errout),
		Dropin:      float64(netInfo[0].Dropin),
		Dropout: 	 float64(netInfo[0].Dropout),
	}
	tmpNetMetricList.BytesSent = append(tmpNetMetricList.BytesSent, tmpNetMetric.BytesSent)
	tmpNetMetricList.BytesRecv = append(tmpNetMetricList.BytesRecv, tmpNetMetric.BytesRecv)
	tmpNetMetricList.PacketsSent = append(tmpNetMetricList.PacketsSent, tmpNetMetric.PacketsSent)
	tmpNetMetricList.PacketsRecv = append(tmpNetMetricList.PacketsRecv, tmpNetMetric.PacketsRecv)
	tmpNetMetricList.Errin = append(tmpNetMetricList.Errin, tmpNetMetric.Errin)
	tmpNetMetricList.Errout = append(tmpNetMetricList.Errout, tmpNetMetric.Errout)
	tmpNetMetricList.Dropin = append(tmpNetMetricList.Dropin, tmpNetMetric.Dropin)
	tmpNetMetricList.Dropout = append(tmpNetMetricList.Dropout, tmpNetMetric.Dropout)

	var length = len(tmpusageMeList.Cpusage)
	if length > 7 {
		tmpusageMeList.Cpusage = tmpusageMeList.Cpusage[length-7:]
		tmpusageMeList.Memusage = tmpusageMeList.Memusage[length-7:]
		tmpusageMeList.Swapusage = tmpusageMeList.Swapusage[length-7:]

		tmpLoadMeList.Load1 = tmpLoadMeList.Load1[length-7:]
		tmpLoadMeList.Load5 = tmpLoadMeList.Load5[length-7:]
		tmpLoadMeList.Load15 = tmpLoadMeList.Load15[length-7:]

		tmpNetMetricList.BytesSent = tmpNetMetricList.BytesSent[length-7:]
		tmpNetMetricList.BytesRecv = tmpNetMetricList.BytesRecv[length-7:]
		tmpNetMetricList.PacketsSent = tmpNetMetricList.PacketsSent[length-7:]
		tmpNetMetricList.PacketsRecv = tmpNetMetricList.PacketsRecv[length-7:]
		tmpNetMetricList.Errin = tmpNetMetricList.Errin[length-7:]
		tmpNetMetricList.Errout = tmpNetMetricList.Errout[length-7:]
		tmpNetMetricList.Dropin = tmpNetMetricList.Dropin[length-7:]
		tmpNetMetricList.Dropout = tmpNetMetricList.Dropout[length-7:]

	}
}


func registerLSRoutes(router *gin.Engine) {
	LS := router.Group("/LS")
	{
		LS.GET("/showLS", showLS)
	}
}

