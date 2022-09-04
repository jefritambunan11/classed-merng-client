import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Button, Label, Icon } from 'semantic-ui-react'

import MyPopup from '../util/MyPopup'

export default function LikeButton({ user, post: { id, likeCount, likes } }) {
    let [liked, setLiked] = useState(false)

    useEffect(() => {
        if (user && likes.find((like) => like.username === user.username)) {
            setLiked(true)
        } else {
            setLiked(false)
        }
    }, [user, likes])


    let [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: { postID: id }
    })


    let likeButton = user ? (
        liked ? (
        <Button color="teal">
         <Icon name="heart" />
        </Button>
        ) : (
        <Button color="teal" basic>
            <Icon name="heart" />
        </Button>
        )
    ) : (
        <Button as={Link} to="/login" color="teal" basic>
            <Icon name="heart" />
        </Button>
    )


    return (
        <Button as="div" labelPosition="right" onClick={likePost}>

            <MyPopup content={liked ? 'Unlike' : 'Like'}>{likeButton}</MyPopup>

            <Label basic color="teal" pointing="left">
                {likeCount}
            </Label>
            
        </Button>
    )
}


let LIKE_POST_MUTATION = gql`
    mutation likePost($postID: ID!) {
        likePost(postID: $postID) {
            id
            likes {
                id
                username
            }
            likeCount
        }
    }
`

 