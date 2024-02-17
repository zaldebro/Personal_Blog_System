package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
	"net/http"
	"time"
)

//const addr = "192.168.5.135:6379"
//const password = ""

// 创建redis客户端，连接数据库2，存储映射信息
func newClient2() *redis.Client {
	client := redis.NewClient(&redis.Options{
		Addr:     addr, // redis地址
		Password: password, // 密码
		DB:       2,  // 选择数据库
	})
	return client
}

// 创建redis客户端，连接数据库3，存储组的信息
func newClient3() *redis.Client {
	client := redis.NewClient(&redis.Options{
		Addr:     addr, // redis地址
		Password: password, // 密码
		DB:       3, // 选择数据库
	})
	return client
}

// Blog member information
type blogMeIn struct {
	//Id string `bson:"_id" json:"id"`
	Id bson.ObjectId `bson:"_id" json:"id"`
	Title string `bson:"title" json:"title"`
	Date string `bson:"date" json:"date"`
	Tags []string `bson:"tags" json:"tags"`
}

// Blog grouping information
type blogGrIn struct {
	Name string `json:"name"`
	Platform string `json:"platform"`
	Version string `json:"version"`
	UpgradeNum string `json:"upgrade_num"`
	Creator string `json:"creator"`
	CreatedAt string `json:"created_at"`
	BlogMeInList []blogMeIn `json:"blog_me_in_list"`
}

// 查询分组信息
func getGroupData(c *gin.Context) {

	// 创建redis客户端，连接数据库2，存储映射信息
	client2 := newClient2()
	defer client2.Close()

	// 创建redis客户端，连接数据库3，存储组的信息
	client3 := newClient3()
	defer client3.Close()

	// 创建mongo客户端
	mongo, err := mgo.Dial(mongoUrl)
	if err != nil{
		log.Fatal(err)
	}
	defer mongo.Close()

	groupList, err := client3.Keys("*").Result()
	if err != nil{
		c.JSON(http.StatusOK, gin.H{"blogGrInList": "None"})
	}else {
		var blogGrInList []blogGrIn

		for _, group := range groupList{
			var blogMeInList []blogMeIn

			// 获取分组信息
			//fmt.Println("group: ", group)
			groupInfo, err := client3.HGetAll(group).Result()
			if err != nil{
				//c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				fmt.Println("分组：", group, "暂时不存在！")
			}

			// 获取分组的成员
			members, err := client2.SMembers(group).Result()
			if err != nil{
				//c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			}else {
				for _, member := range members{
					client := mongo.DB("info").C("article")
					var info blogMeIn
					err = client.Find(bson.M{"title": member}).One(&info)
					if err != nil{
						//c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
						//fmt.Println("分组：", group, "的成员",  members, "暂时不存在！")
					}else {
						blogMeInList = append(blogMeInList, info)
					}
				}
			}
			tmpTeBlGrIn := blogGrIn{
				Name : groupInfo["name"],
				Platform: groupInfo["platform"],
				Version : groupInfo["version"],
				UpgradeNum : groupInfo["upgradeNum"],
				Creator : groupInfo["creator"],
				CreatedAt : groupInfo["createdAt"],
				BlogMeInList : blogMeInList,
			}
			blogGrInList = append(blogGrInList, tmpTeBlGrIn)
		}
		c.JSON(http.StatusOK, gin.H{"blogGrInList": blogGrInList})
	}
}

// 定义显示博客标题的结构体
type blogTi struct {
	Title string `bson:"title"`
}

// 获取所有博客标题 Get all blog titles
func getAlBlTi(c *gin.Context) {
	mongo, err := mgo.Dial(mongoUrl)
	if err != nil {
		log.Fatal(err)
	}
	defer mongo.Close()
	var listofblogTi[]blogTi

	client := mongo.DB("info").C("article")
	err = client.Find(bson.M{}).All(&listofblogTi)
	if err != nil{
		//fmt.Println("error: ", err.Error())
		//c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}else {
		//fmt.Println("listofblogTi: ", listofblogTi)
		c.JSON(http.StatusOK, gin.H{"listofblogTi": listofblogTi})
	}
}

// 添加博客组成员 Add blogger group members
type addBlogGrMe struct {
	Groupname       string  `json:"groupname"`
	Checkedlist []string `json:"checkedlist"`
}

// 添加分组成员 Add group members
func addGroupMe(c *gin.Context) {
	var blogGrMe addBlogGrMe
	if err := c.ShouldBindJSON(&blogGrMe); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}else {
		client2 := newClient2()
		for _, members := range blogGrMe.Checkedlist{
			if err := client2.SAdd(blogGrMe.Groupname, members).Err(); err != nil{
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			}
		}
		c.JSON(http.StatusOK, gin.H{})
	}
}

// 删除分组成员 Delete group members
func delGroupMe(c *gin.Context) {
	var delMe struct {
		Groupname string `json:"groupname"`
		Checkedlist []string `json:"checkedlist"`
	}
	if err := c.ShouldBindJSON(&delMe); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}else {
		fmt.Println("delMe: ", delMe)
		client2 := newClient2()
		for _, members := range delMe.Checkedlist{
			if err := client2.SRem(delMe.Groupname, members).Err(); err != nil{
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			}
		}
		c.JSON(http.StatusOK, gin.H{})
	}
}

//增加博客分组
func addGroup(c *gin.Context){
	var addGr blogGrIn

	if err := c.ShouldBindJSON(&addGr); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}else {
		client3 := newClient3()
		defer client3.Close()
		addGr.CreatedAt = time.Now().Format("2006-01-02 15:04:05")
		err := client3.HMSet(fmt.Sprintf("%v", addGr.Name), map[string]interface{}{
			"name": addGr.Name,
			"platform": addGr.Platform,
			"version": addGr.Version,
			"upgradeNum": addGr.UpgradeNum,
			"creator": addGr.Creator,
			"createdAt": addGr.CreatedAt,
		}).Err()
		if err != nil{
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		}
		c.JSON(http.StatusOK, gin.H{})
	}
}

//查询所有博客分分组名称 Query all blog group names
func queryGroupNa(c *gin.Context) {
	client := newClient3()
	defer client.Close()
	listofGrNa, err := client.Keys("*").Result()
	if err != nil{
		c.JSON(http.StatusBadRequest, err.Error())
	}
	c.JSON(http.StatusOK, gin.H{"listofGrNa": listofGrNa})

}

//删除博客分组
func delGroup(c *gin.Context){
	client := newClient3()
	defer client.Close()

	client2 := newClient2()
	defer client2.Close()

	var delGr struct {
		DelGroupLi []string `json:"del_group_li"`
	}
	if err := c.ShouldBindJSON(&delGr); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}else {
		for _, grName := range delGr.DelGroupLi {
			err := client.Del(grName).Err()
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			}
			if err := client2.Del(grName).Err(); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			}
		}
		c.JSON(http.StatusOK, gin.H{})
	}
}


// 注册函数
func registerBlogGroupRoutes(router *gin.Engine) {
	grRedis := router.Group("/group")
	{
		grRedis.GET("/getGroupData", getGroupData)
		grRedis.GET("/getAlBlTi", getAlBlTi)
		grRedis.POST("/addGroupMe", addGroupMe)
		grRedis.POST("/delGroupMe", delGroupMe)
		grRedis.GET("/getAlGrNa", queryGroupNa)
		grRedis.POST("/delGroup", delGroup)
		grRedis.POST("/addGroup", addGroup)
	}
}