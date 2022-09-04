import React, {useContext} from 'react'
import {useQuery} from '@apollo/react-hooks'
// import gql from 'graphql-tag'
import { Grid, Transition } from 'semantic-ui-react'

import { AuthContext } from '../context/auth'
import PostCard from '../components/PostCard'
import PostForm from '../components/PostForm'

import { FETCH_POSTS_QUERY } from '../util/graphql'

export default function Home() {
    let context = useContext(AuthContext)

    let {loading, data: {getPosts: posts}} = useQuery(FETCH_POSTS_QUERY)

  

    return (
        <div>
            <Grid columns={3} >
                <Grid.Row className="page-title">
                    <h1>Recent Posts</h1>
                </Grid.Row>
                
                <Grid.Row>
                    {context.user && (
                        <Grid.Column>
                            <PostForm />
                        </Grid.Column>
                    )}
                    {
                    loading 
                    ? 
                    (
                        <h1>Loading posts..</h1>
                    ) 
                    : 
                    (
                        <Transition.Group>
                            {posts && posts.map(post => (
                                <Grid.Column 
                                    key={post.id} 
                                    style={{ marginBottom: 12 }}
                                >
                                    <PostCard post={post} />
                                </Grid.Column>
                            ))}
                        </Transition.Group>
                        )
                    }
                </Grid.Row>
            </Grid>
        </div>
    )
}
