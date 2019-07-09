var app = angular.module('myApp');

/**
 * @Author      : Theory
 * @Description : 管理员页面控制器
 * @type        : Controller
 */
app.controller('administerCtrl', function ($scope, $http, $state) {

    $scope.currentSystemManager = null;//当前系统管理员

    $scope.nowPage = 1;

    $scope.allSystemManager = null;//所有的系统管理员
    $scope.allLessonManager = null;//所有的课程管理员
    $scope.allSchools = null;//所有的学校
    $scope.academys = null;//在已选学校的前提下获取此学校的所有学院

    $scope.totalP = 1;//课程管理员总页数
    $scope.currentP = 1;//课程管理员当前页数
    $scope.Ps = [];

    $scope.bindSysMan = null;//当前选中的系统管理员
    $scope.bindLeMan = null;//当前被选中的课程管理员
    $scope.bindSchool = null;//page2当前被选中的学校
    $scope.bindSchoolAcademys = null;//page3的学院
    $scope.page3School = null;//page3当前被选中的学校



    //初始化管理员信息
    $scope.initManager = function () {
        $scope.getLessonRank();
        $scope.getAllSystemManagers();//获取所有管理员信息
        $scope.getAllLessonManagers();//获取所有课程管理员信息
        $scope.getAllSchools();//获取所有学校
        var token = window.localStorage.getItem('token');
        var phone = window.localStorage.getItem('phone');
        $http({
            method: 'GET',
            url: '/student/info',
            headers: {
                'Authorization': token
            },
            params: {
                "phone": phone
            }
        }).then(function successCallback(response) {
            $scope.currentSystemManager = response.data;
        });
    };


    //获取课程排名图片
    $scope.getLessonRank = function(){
        var token = window.localStorage.getItem('token');
        $http({
            method: 'GET',
            url: '/student/allGraph',
            headers: {
                'Authorization': token
            }
        }).then(function successCallback(response) {
        });
    };


    //跳转页面
    $scope.jump = function (page) {
        $scope.nowPage = page;
    };


    //第一面
    $scope.page_1 = function () {
        return $scope.nowPage == 1;
    };
    //第二面
    $scope.page_2 = function () {
        return $scope.nowPage == 2;
    };
    //第三面
    $scope.page_3 = function () {
        return $scope.nowPage == 3;
    };
    //第四面
    $scope.page_4 = function () {
        return $scope.nowPage ==4;
    };


    //获取所有的系统管理员
    $scope.getAllSystemManagers = function () {
        var token = window.localStorage.getItem('token');
        $http({
            method: 'GET',
            headers: {
                'Authorization': token
            },
            url: '/student/manager'
        }).then(function successCallback(response) {
            $scope.allSystemManager = response.data;
        })
    };


    //分页获取所有的课程管理员
    $scope.getAllLessonManagers = function(){
        var token = window.localStorage.getItem('token');
        var p = $scope.currentP-1;
        $http({
            method: 'GET',
            headers: {
                'Authorization': token
            },
            url: "/student/lessonManagerPages?page="+p
        }).then(function successCallback(response) {
            $scope.allLessonManager = response.data.content;//获取返回的课程
            $scope.totalP = response.data.totalPages;//获取最大页数
            $scope.Ps = [];
            if($scope.totalP>5) {
                var start = ($scope.currentP>=3) ? $scope.currentP-2 : 1;
                var end = ($scope.currentP<=$scope.totalP-2) ? start+4 : $scope.totalP;
                for(var i = start;i<=end;i++)
                    $scope.Ps.push(i);
            }else{
                for(var i = 1;i<=$scope.totalP;i++)
                    $scope.Ps.push(i);
            }
        });
    };


    //获取所有学校
    $scope.getAllSchools = function(){
        $http({
            method: 'GET',
            url: '/school'
        }).then(function successCallback(response) {
            $scope.allSchools = response.data;
        })
    };

    //获取page2指定学校下的学院
    $scope.getAcademy = function(i){
        var token = window.localStorage.getItem('token');
        var schoolName = "";
        if(i==0)
            schoolName = $('#allSchools').find('option:selected').text();
        else
            schoolName = $('#leSchool').find('option:selected').text();
        $http({
            method: 'GET',
            url: '/academy/schoolName',
            headers: {
                'Authorization': token
            },
            params:{
                "schoolName":schoolName
            }
        }).then(function successCallback(response) {
            $scope.academys = response.data;
        })
    };


    //获取page3指定学校下的学院
    $scope.getPage3Academy = function(x){
        var token = window.localStorage.getItem('token');
        $scope.page3School = x;
        $http({
            method: 'GET',
            url: '/academy/schoolName',
            headers: {
                'Authorization': token
            },
            params:{
                "schoolName":x.schoolName
            }
        }).then(function successCallback(response) {
            $scope.bindSchoolAcademys = response.data;
        })
    };


    //选择页号
    $scope.selectP = function (page) {
        if ($scope.totalP == 0 && (page < 1 || page > $scope.totalP))
            return;
        $scope.currentP = page;
        $scope.getAllLessonManagers();
    };

    //上一页
    $scope.pre = function () {
        $scope.selectP($scope.currentP-1);
    };

    //下一页
    $scope.next = function () {
        $scope.selectP($scope.currentP+1);
    };

    //绑定当前系统管理员
    $scope.bindingSys = function (x) {
        $scope.bindSysMan = x;
    };

    //绑定当前课程管理员
    $scope.bindingLeMan = function(x){
      $scope.bindLeMan = x;
    };

    //绑定当前选定的学校
    $scope.bindingSchool = function(x){
      $scope.bindSchool = x;
    };





    //删除当前选中的系统管理员
    $scope.deleteSys = function (x) {
        var token = window.localStorage.getItem('token');
        $http({
            method: 'DELETE',
            url: '/student',
            headers: {
                'Authorization': token
            },
            params:{
                "phone": x.phone
            }
        }).then(function successCallback(response) {
            if(response.status == 200){
                $scope.getAllSystemManagers();
            }else{
                alert("删除失败!");
            }
        })
    };



    //按照搜索类型和关键词搜索课程管理员
    $scope.searchByType = function(){
        var token = window.localStorage.getItem('token');
          var type = $('#keyType').find('option:selected').val();
          var val = $('#searchVal').val();
          if(type=="name"){
              $http({
                  method: 'GET',
                  url: '/student/lessonManagerPagesByName',
                  headers: {
                      'Authorization': token
                  },
                  params:{
                      "realName":val
                  }
              }).then(function successCallback(response) {
                  $scope.allLessonManager = response.data.content;//获取返回的课程
                  $scope.totalP = response.data.totalPages;//获取最大页数
                  $scope.Ps = [];
                  if($scope.totalP>5) {
                      var start = ($scope.currentP>=3) ? $scope.currentP-2 : 1;
                      var end = ($scope.currentP<=$scope.totalP-2) ? start+4 : $scope.totalP;
                      for(var i = start;i<=end;i++)
                          $scope.Ps.push(i);
                  }else{
                      for(var i = 1;i<=$scope.totalP;i++)
                          $scope.Ps.push(i);
                  }
              })
          }else if(type=="school"){
              $http({
                  method: 'GET',
                  url: '/student/lessonManagerPagesBySchool',
                  headers: {
                      'Authorization': token
                  },
                  params:{
                      "schoolName":val
                  }
              }).then(function successCallback(response) {
                  $scope.allLessonManager = response.data.content;//获取返回的课程
                  $scope.totalP = response.data.totalPages;//获取最大页数
                  $scope.Ps = [];
                  if($scope.totalP>5) {
                      var start = ($scope.currentP>=3) ? $scope.currentP-2 : 1;
                      var end = ($scope.currentP<=$scope.totalP-2) ? start+4 : $scope.totalP;
                      for(var i = start;i<=end;i++)
                          $scope.Ps.push(i);
                  }else{
                      for(var i = 1;i<=$scope.totalP;i++)
                          $scope.Ps.push(i);
                  }
              })
          }
    };


    //更新当前的课程管理员
    $scope.updateLessonMan = function () {
        var token = window.localStorage.getItem('token');
        var realName = $('#relName_2').val();//真实姓名
        var schoolName = $('#allSchools').find('option:selected').text();//学校名
        var academyName =$('#allAcdemys').find('option:selected').text();//学院名
        $http({
            method: 'PUT',
            url: '/student',
            headers: {
                'Authorization': token
            },
            data:{
                "phone": $scope.bindLeMan.phone,
                "academyName": academyName,
                "birth": $scope.bindLeMan.birth,
                "email": $scope.bindLeMan.email,
                "introduction": $scope.bindLeMan.introduction,
                "isLessonManager": 1,
                "isManager": 0,
                "nickName": $scope.bindLeMan.nickName,
                "pwd": $scope.bindLeMan.pwd,
                "realName": realName,
                "schoolName": schoolName,
                "sex": $scope.bindLeMan.sex
            }
        }).then(function successCallback(response) {
            if(response.status == 200){
                $('#infoModal_2').modal('hide');
                $scope.initManager();
            }else{
                alert("修改失败!");
            }
        })
    };

    //删除选定的课程管理员
    $scope.deleteLeMan = function () {
        var token = window.localStorage.getItem('token');
        $http({
            method: 'DELETE',
            url: '/student',
            headers: {
                'Authorization': token
            },
            params:{
                "phone": $scope.bindLeMan.phone
            }
        }).then(function successCallback(response) {
            if(response.status == 200){
                alert("删除成功!");
                $('#deleteLModal').modal('hide');
                $scope.initManager();
            }else{
                alert("删除失败!");
            }
        })
    };


    //添加课程管理员
    $scope.addLeMan = function () {
        var token = window.localStorage.getItem('token');
        var phone = $('#lePhone').val();//电话
        var realName = $('#leName').val();//真实姓名
        var pwd = $('#lePwd').val();//电话
        var schoolName = $('#leSchool').find('option:selected').text();//学校名
        var academyName =$('#leAcademy').find('option:selected').text();//学院名
        $http({
            method: 'POST',
            url: '/student/registerLessonManager',
            headers: {
                'Authorization': token
            },
            data:{
                "phone": phone,
                "academyName": academyName,
                "isLessonManager": 1,
                "isManager": 0,
                "pwd": pwd,
                "realName": realName,
                "schoolName": schoolName,
            }
        }).then(function successCallback(response) {
            if(response.status == 200){
                $('#addLModal').modal('hide');
                $scope.initManager();
            }else{
                alert("添加失败!");
            }
        })
    };


    //添加学校
    $scope.addSchool = function () {
        var token = window.localStorage.getItem('token');
        var schoolName = $('#schoolName').val();
        var schoolIntro = $('#schoolIntro').val();
        $http({
            method: 'POST',
            url: '/school',
            headers: {
                'Authorization': token
            },
            data:{
                "schoolIntro": schoolIntro,
                "schoolName": schoolName
            }
        }).then(function successCallback(response) {
            if(response.data == true){
                alert("增添成功!");
                $('#addSModal').modal('hide');
                $scope.initManager();
            }else{
                alert("此学校已存在! 增添失败!");
            }
        })
    };


    //添加学院
    $scope.addAcademy = function () {
        var token = window.localStorage.getItem('token');
        var academyName = $('#academyName').val();
        var schoolName = $('#schools').find('option:selected').text();
        $http({
            method: 'POST',
            url: '/academy',
            headers: {
                'Authorization': token
            },
            data:{
                "academyName": academyName,
                "schoolName": schoolName
            }
        }).then(function successCallback(response) {
            if(response.data == true){
                alert("增添成功!");
                $('#addAModal').modal('hide');
                $scope.getPage3Academy($scope.page3School);
            }else{
                alert("此学院已存在! 增添失败!");
            }
        })
    };


    //删除学院
    $scope.deleteAcademy = function () {
        var token = window.localStorage.getItem('token');
        var academyId = $('input[name="selection"]:checked').val();//获取被选中的学院id
        $http({
            method: 'DELETE',
            url: '/academy',
            headers: {
                'Authorization': token
            },
            params:{"id": academyId}
        }).then(function successCallback(response) {
            if(response.status == 200){
                alert("删除成功!");
                $scope.getPage3Academy($scope.page3School);
            }else{
                alert("删除失败!");
            }
        })
    };


    //上传学校图片
    $scope.uploadSImg = function() {
        $("#schoolImgForm").ajaxForm(function (data) {
            alert("上传成功！");
            $('#schoolImgModal').modal('hide');
        });
    };

});



