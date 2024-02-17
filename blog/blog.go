package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
	"net/http"
	"time"
)

type blogInfo struct {
	Id bson.ObjectId `bson:"_id"`
	Title string `bson:"title"`
	Content string `bson:"content"`
	Date string `bson:"date"`
	Tags []string `bson:"tags"`
}

// 获取博客列表
func blogList (c *gin.Context) {
	mongo, err := mgo.Dial(mongoUrl)
	if err != nil {
		log.Fatal(err)
	}
	defer mongo.Close()
	var listofBlog []blogInfo

	client := mongo.DB("info").C("article")
	err = client.Find(bson.M{}).All(&listofBlog)
	if err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"blogList":""})
		log.Fatal(err)
	}else {
		// 截取文章内容部分的信息，防止文章过长
		for i := range listofBlog{
			if len(listofBlog[i].Content) > 350 {
				listofBlog[i].Content = listofBlog[i].Content[:350]
			}
		}
		//fmt.Println("listofBlog: ", listofBlog)
		c.JSON(http.StatusOK, gin.H{"blogList": listofBlog})
	}
}

// 根据博客id查询博客信息
func blogId (c *gin.Context) {
	mongo, err := mgo.Dial(mongoUrl)
	if err != nil{
		log.Fatal(err)
	}
	defer mongo.Close()
	client := mongo.DB("info").C("article")
	idFromUrl := c.Param("blogId")
	id := bson.ObjectIdHex(idFromUrl)

	var info blogInfo

	err = client.Find(bson.M{"_id": id}).One(&info)
	if err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"blogInfo": nil})
		log.Fatal(err)
	}else {
		fmt.Println(info)
		c.JSON(http.StatusOK, gin.H{"blogInfo": info})
	}
}

// 写博客
func blogging(c *gin.Context) {
	var blogInfo struct{
		Title string `json:"title"`
		Content string `json:"content"`
		Date string `json:"date"`
		Tags []string `json:"tags"`
	}

	// 获取接收到的数据
	err := c.Bind(&blogInfo)
	if err != nil{
		fmt.Println(err)
		c.JSON(http.StatusBadGateway, gin.H{"error": "数据类型不合法！"})
	}

	blogInfo.Date = time.Now().Format("2006-01-02 15:04:05")

	// 向mongodb中添加存储信息
	mongo, err := mgo.Dial(mongoUrl)
	if err != nil{
		fmt.Println(err)
	}
	defer mongo.Close()
	client := mongo.DB("info").C("article")

	err = client.Insert(&blogInfo)
	if err != nil{
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{})
		//log.Fatal(err)
	}else {
		c.JSON(http.StatusOK, gin.H{})
	}
	c.JSON(http.StatusOK, gin.H{})
}

// 删除博客 Delete the blog
func delBLog(c *gin.Context) {
	mongo, err := mgo.Dial(mongoUrl)
	if err != nil{
		log.Fatal(err)
	}
	defer mongo.Close()
	client := mongo.DB("info").C("article")
	var blogTitle struct{
		Title string `json:"title"`
	}
	if err := c.ShouldBindJSON(&blogTitle); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println("error: ", err)
	}else {
		if err = client.Remove(bson.M{"title": blogTitle.Title}); err != nil{
			fmt.Println("error: ", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		}else {
			c.JSON(http.StatusOK, gin.H{})
		}
	}
}

func registerBlogRoutes(router *gin.Engine) {
	blog := router.Group("/blog")
	{
		blog.GET("/list", blogList)
		blog.GET("/info/:blogId", blogId)
		blog.POST("/add", blogging)
		blog.POST("/delBLog", delBLog)
	}
}