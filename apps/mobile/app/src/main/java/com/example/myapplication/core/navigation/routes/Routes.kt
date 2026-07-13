package com.example.myapplication.core.navigation.routes

sealed class Routes(val route: String) {
    data object Login : Routes("login")
    data object Feed : Routes("feed")
}