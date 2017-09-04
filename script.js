var app = angular.module('app', []);

app.controller('getMovie', function ($scope, $http) {
    $scope.list = [];

    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var today = year + "-" + month + "-" + day;


    var client_id = "Your client ID"; // https://trakt.tv/oauth/applications/new
    var tmdb_key = "Your TMDB key";
    var trakt_token = "Your token code"; // http://docs.trakt.apiary.io/#reference/authentication-oauth/authorize

    $http({
        method: "GET",
        url: "https://api.trakt.tv/calendars/my/shows/" + today + "/30", // 30 = Days to check for episodes
        headers: {
            'Authorization': 'Bearer ' + trakt_token,
            'trakt-api-key': client_id
        }
    }).then(function success(response) {
        $scope.list = response.data;
        $scope.getPoster();
    }, function error(response) {
        console.log(response.statusText);
    });

    $scope.getPoster = function() {
        angular.forEach($scope.list, function(v, i) {
            var id = v.show.ids.tmdb;
            var url = "https://api.themoviedb.org/3/tv/" + id + "?api_key=" + tmdb_key + "&language=en-US";
            $http({
                method: "GET",
                url: url
            }).then(function success(response) {
                $scope.list[i].poster_path = "https://image.tmdb.org/t/p/w500/" + response.data.poster_path;
            }, function error(response) {
                console.log(response.statusText);
            });
        });
    }
});

app.filter('countdown', function() {
    return function(x) {
        var countdown = "";
        var date = new Date(x).getTime();
        var now = new Date().getTime();
        var distance = date - now;
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        countdown = days + " days " + hours + " hours " + minutes + " minutes";

        return countdown;
    };
});
