import React, {useContext, useState, useRef} from 'react'
import gql from 'graphql-tag'
import {useQuery, useMutation} from '@apollo/react-hooks'
import { Button, Form, Grid, Card, Image, Icon, Label } from 'semantic-ui-react'
import moment from 'moment'

import { AuthContext } from '../context/auth'
import LikeButton from '../components/LikeButton'
import DeleteButton from '../components/DeleteButton'
import MyPopup from '../util/MyPopup'

export default function SinglePost(props) {
    let context = useContext(AuthContext)    
    let postID = props.match.params.postID 
   
    let { data: {getPost: post}} = useQuery(FETCH_POST_QUERY, {
        variables: {
            postID
        }
    })

    let commentInputRef = useRef(null)
    let [comment, setComment] = useState('')


    let [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        update() {
            setComment('')
            commentInputRef.current.blur()
        },
        variables: {
            postID,
            body: comment
        }
    })
        
    function deletePostCallback() {
        props.history.push('/')
    }


    let postMarkup

    if (!post) {       
        postMarkup = <p>Loading...</p>
    } else {
        let {
            id, 
            username, 
            body,
            createdAt,
            comments,
            likes,
            commentCount,
            likeCount,
        } = post

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image 
                            src="https://react.semantic-ui.com/images/avatar/large/molly.png"
                            size="small"
                            float="right"
                        />
                    </Grid.Column>

                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>
                                    {moment(createdAt).fromNow(true)}
                                </Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>

                            <hr />

                            <Card.Content extra>
                                <LikeButton 
                                    user={context.user}
                                    post={{id, likeCount, likes}}
                                />

                                <MyPopup content="Comment on post">
                                    <Button
                                        as="div"
                                        labelPosition="right"
                                        onClick={() => console.log('Comment on post')}
                                    >
                                        <Button
                                            basic
                                            color="blue"
                                        >
                                            <Icon name="comments" />
                                        </Button>

                                        <Label
                                            basic
                                            color="blue"
                                            pointing="left"
                                        >
                                            {commentCount}
                                        </Label>                                    
                                    </Button>
                                </MyPopup>

                                {
                                    context.user && context.user.username === username && (
                                        <DeleteButton 
                                            postID={postID} 
                                            callback={deletePostCallback}
                                        />
                                    )
                                }

                            </Card.Content>
                        </Card>

                        {
                            context.user && (
                                <Card fluid>
                                    <Card.Content>
                                        <p>Post a comment</p>

                                        <Form>
                                            <div className="ui action input fluid">
                                                <input
                                                    type="text"
                                                    placeholder="Comment.."
                                                    name="comment"
                                                    value={comment}
                                                    onChange={(event) => setComment(event.target.value)}
                                                    ref={commentInputRef}
                                                />

                                                <button
                                                    type="submit"
                                                    className="ui button teal"
                                                    disabled={comment.trim() === ''}
                                                    onClick={submitComment}
                                                >
                                                    Submit
                                                </button>

                                            </div>
                                        </Form>
                                    </Card.Content>
                                </Card>
                            )
                        }

                        {
                            comments.map(comment => (
                                <Card fluid key={comment.id}>
                                    <Card.Content>
                                        {
                                        context.user && context.user.username === comment.username && (
                                            <DeleteButton 
                                                postID={postID} 
                                                commentID={comment.id} 
                                            />
                                        )
                                        }
                                        <Card.Header>{comment.username}</Card.Header>
                                        <Card.Meta>
                                            {moment(comment.createdAt).fromNow()}
                                        </Card.Meta>
                                        <Card.Description>{comment.body}</Card.Description>
                                    </Card.Content>
                                </Card>
                            ))
                        }


                    </Grid.Column>
                  
                    
                </Grid.Row>

            </Grid>
        )
    }

    return postMarkup

}


const SUBMIT_COMMENT_MUTATION = gql`
    mutation($postID: String!, $body: String!) {
        createComment(postID: $postID, body: $body) {
            id
            comments {
                id
                body
                createdAt
                username
            }
            commentCount
        }
    }
`

let FETCH_POST_QUERY = gql`
    query getPost($postID: ID!) {
        getPost(postID: $postID) {
            id
            body
            createdAt
            username
            likes {
                id
                username
                createdAt
            }
            likeCount
            comments {
                id
                body
                username
                createdAt
            }
            commentCount
        }
    }
`
