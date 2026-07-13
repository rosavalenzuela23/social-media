package com.example.myapplication

import android.app.Application
import com.example.myapplication.core.network.ApiProvider

class MyApp : Application() {

    override fun onCreate() {
        super.onCreate()

        ApiProvider.init(
            context = this,
            baseUrl = "http://127.0.0.1:3000/"
        )
    }
}