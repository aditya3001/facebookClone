$(() => {
    // let postDiv = $('#postDiv')
    console.log($('#userId').html())

    function refreshPostList() {
        $.get('/profile/posts/' + $('#userId').html(), (data) => {
            $("#profilePostDiv").empty()
            for (let post of data.posts) {

                html = $("<div class='card' style='height:200px;'>").append($("<div class='card-body'>")
                    // .append($('<h3>').attr('class', 'card-subtitle mb-2 text-muted').text(`BY : ${post.name}(${post.email})`))
                    .append($('<a>').attr('class', 'card-subtitle mb-2 text-muted').addClass('authorName').attr('href', '/profile/' + post.user.id).text(post.user.name))
                    .append($('<h6>').attr('class', 'card-subtitle mb-2 text-muted').text(post.createdAt))
                    .append($('<div>').attr('class', 'box')
                        .append($('<div>').attr('class', 'text').text(post.text)))

                );
                $("#profilePostDiv").append(html);
            }
        })

    }







    refreshPostList();

    function setFollowButtonText() {
        $.get('/profile/checkFollowing/' + $('#userId').html(), (data) => {
            console.log(data)
            if (data == "alreadyFollowing") {
                $('button.followButton').addClass('following')
                $('button.followButton').text('Following');
            } else {
                $('button.followButton').removeClass('following')
                $('button.followButton').text('Follow');
            }
        })
    }

    setFollowButtonText();

    $('button.followButton').on('click', function(e) {
        e.preventDefault();
        $button = $(this);
        console.log($button.hasClass('following'))
        if ($button.hasClass('following')) {

            //$.ajax(); Do Unfollow
            $.get('/profile/unfollow/' + $('#userId').html())
            console.log("Request To UnFollow")

            $button.removeClass('following');
            $button.removeClass('unfollow');
            $button.text('Follow');
        } else {

            // $.ajax(); Do Follow
            console.log("Request To Follow")
            $.get('/profile/follow/' + $('#userId').html())
            $button.addClass('following');
            $button.text('Following');
        }
    });

    $('button.followButton').hover(function() {
        $button = $(this);
        if ($button.hasClass('following')) {
            $button.addClass('unfollow');
            $button.text('Unfollow');
        }
    }, function() {
        if ($button.hasClass('following')) {
            $button.removeClass('unfollow');
            $button.text('Following');
        }
    });

})