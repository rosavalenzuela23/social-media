package com.example.myapplication.core.network

import android.content.Context
import com.example.myapplication.core.session.SessionManager
import com.example.myapplication.features.auth.data.AuthApi
import com.example.myapplication.features.posts.data.PostsApi
import com.example.myapplication.features.profile.data.ProfileApi
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object ApiProvider {

    lateinit var sessionManager: SessionManager
        private set

    lateinit var cookieJar: SessionCookieJar
        private set

    lateinit var authApi: AuthApi
        private set

    lateinit var profileApi: ProfileApi
        private set

    lateinit var postsApi: PostsApi
        private set

    fun init(
        context: Context,
        baseUrl: String
    ) {
        sessionManager = SessionManager(context.applicationContext)
        cookieJar = SessionCookieJar()

        val okHttpClient = OkHttpClient.Builder()
            .cookieJar(cookieJar)
            .build()

        val retrofit = Retrofit.Builder()
            .baseUrl(baseUrl)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        authApi = retrofit.create(AuthApi::class.java)
        profileApi = retrofit.create(ProfileApi::class.java)
        postsApi = retrofit.create(PostsApi::class.java)
    }
}