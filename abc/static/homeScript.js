$(() => {
    // let postDiv = $('#postDiv')


    function refreshPostList() {
        $.get('/home/posts', (posts) => {
            $("#postDiv").empty()
            for (let post of posts) {

                constructCommentHtml(post._id, post, (a, b, c) => {
                    // populatePosts(a, b)
                    getLikeState(a, b, c, (p, q, r) => {
                        populatePosts(p, q, r)
                    })
                })
            }
        })

    }

    function populatePosts(post, commentHtml, likeState) {
        console.log(likeState)
        html = $("<div class='card'>").append($("<div class='card-body'>")
            // .append($('<h3>').attr('class', 'card-subtitle mb-2 text-muted').text(`BY : ${post.name}(${post.email})`))
            .append($('<a>').attr('class', 'card-subtitle mb-2 text-muted').addClass('authorName').attr('href', '/profile/' + post.user.id).text(post.user.name))
            .append($('<h5>').attr('class', 'card-subtitle mb-2 text-muted').text(post.createdAt))
            .append($('<div>').attr('class', 'box')
                .append($('<div>').attr('class', 'text').text(post.text)))
            .append($('<button>').addClass('btn-primary-jq').text(likeState.st).click(function() {
                if ($(this).html() == "Like") {
                    // console.log("Here IN BUTTON")
                    $.get('/home/post/like/' + post._id, (status) => {
                        console.log("Here IN BUTTON")
                        console.log(status)
                        if (status == "success") {
                            // $(this).html('Unlike');
                            refreshPostList()
                        } else {
                            alert(status)
                        }
                    })

                } else {
                    $.get('/home/post/unlike/' + post._id, (status) => {
                        if (status == "success") {
                            // $(this).html('Like');
                            refreshPostList()
                        } else {
                            alert(status)
                        }
                    })

                }
                return false;
                // $.get('/profile/'+likeState)

            }))
            .append($('<span>').addClass('numLikes').text('(' + likeState.num + ')'))
            .append($('<button>').addClass('btn-primary-jq').text('Add Comment').click(function() {
                $.post('/home/addComment/' + post._id, {
                        text: $(this).next().next().val(),
                        user: post.user
                    }, (data) => {
                        if (data == 'success') {
                            refreshPostList()
                        } else {
                            alert(data)
                        }
                    })
                    // refreshPostList()
            }))
            .append($('<div>').addClass('commentDiv').append(commentHtml))
            .append($('<input>').addClass('commentInput').attr('placeholder', "Enter Comment..."))


        );

        $("#postDiv").append(html);
    }

    $('#createPost').click(() => {

        $.post('/home/addPost', {
            text: $('#postInputText').val()
        }, (data) => {
            if (data == "success") {
                refreshPostList()
            } else {
                alert(data)
            }
        })
    })

    $('#searchBtn').click(() => {
        $.post('/profile/search', {
            text: $('#searchInputText').val()
        }, (data) => {
            console.log(data)
                // document.write(data)
            if (data.msg) {
                alert("User Not Found")
            }
        })
    })

    // $('#searchBtn').click(() => {
    //     $.get('/profile/search/' + $('#searchInputText').val(), (data) => {
    //         console.log(data)
    //         if (data.userId) {
    //             $.get('/profile/' + data.userId)
    //         } else {
    //             alert('User Not Found')
    //         }
    //     })
    // })

    refreshPostList()

    function constructCommentHtml(postId, p, cb) {

        console.log(postId)
        var comHtml = ''
        $.get('/home/comment/' + postId, (comments) => {
            for (let comment of comments) {
                console.log("Here")
                comHtml += $("<div class='card1'>").append($("<div class='card1-body'>")
                    .append($('<a>').attr('class', 'card1-subtitle mb-2 text-muted').addClass('authorName').attr('href', '/profile/' + comment.user.id).text(comment.user.name))
                    .append($('<h6>').attr('class', 'card-subtitle mb-2 text-muted').addClass('commentDate').text(comment.createdAt))
                    .append($('<div>').attr('class', 'box1')
                        .append($('<div>').attr('class', 'text1').text(comment.text)))

                ).html();
            }
            cb(postId, p, comHtml)
        })
    }



    function getLikeState(postId, post, comHtml, cb1) {
        $.get('/home/getLikeState/' + postId, (result) => {
            console.log(result)
            if (result.state == "liked") {
                isLiked = { st: 'Unlike', num: result.numLikes }
                cb1(post, comHtml, isLiked)
            } else if (result.state == "notLiked") {
                isLiked = { st: 'Like', num: result.numLikes }
                cb1(post, comHtml, isLiked)
            } else {
                alert(result)
                isLiked = { st: 'Like', num: result.numLikes }
                cb1(post, comHtml, isLiked)
            }
        })

    }

    // function getLikeState(postId, post, comHtml, cb1) {
    //     $.get('/home/getLikeState/' + postId, (result) => {
    //         console.log(result)
    //         if (result == "liked") {
    //             isLiked = 'Unlike'
    //             cb1(post, comHtml, isLiked)
    //         } else if (result == "notLiked") {
    //             isLiked = 'Like'
    //             cb1(post, comHtml, isLiked)
    //         } else {
    //             alert(result)
    //             isLiked = 'Like'
    //             cb1(post, comHtml, isLiked)
    //         }
    //     })

    // }

})