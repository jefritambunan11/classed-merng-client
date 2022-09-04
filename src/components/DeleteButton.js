import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { Button, Confirm, Icon } from 'semantic-ui-react'

import { FETCH_POSTS_QUERY } from '../util/graphql'
import MyPopup from '../util/MyPopup'

export default function DeleteButton({ postID, commentID, callback }) {
    let [confirmOpen, setConfirmOpen] = useState(false)

    // alert(postID)
    // commentID
    let mutation = commentID ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION

    let [deletePostOrMutation] = useMutation(mutation, {
        update(proxy) {
            setConfirmOpen(false)

            if (!commentID) {
                let data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                })
                data.getPosts = data.getPosts.filter((p) => p.id !== postID)
                proxy.writeQuery({ query: FETCH_POSTS_QUERY, data })
            }

            if (callback) callback()
        },
        variables: {
            postID,
            commentID
        }
    })

    return (
        <>
            <MyPopup content={commentID ? 'Delete comment' : 'Delete post'}>
                <Button
                    as="div"
                    color="red"
                    floated="right"
                    onClick={() => setConfirmOpen(true)}
                >
                <Icon name="trash" style={{ margin: 0 }} />
                </Button>
            </MyPopup>

            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePostOrMutation}
            />

        </>
    )
}

let DELETE_POST_MUTATION = gql`
    mutation deletePost($postID: ID!) {
        deletePost(postID: $postID)
    }
`

let DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($postID: ID!, $commentID: ID!) {
        deleteComment(postID: $postID, commentID: $commentID) {
            id
            comments {
                id
                username
                createdAt
                body
            }
            commentCount
        }
    }
`

 