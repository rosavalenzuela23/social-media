package com.example.myapplication.core.network

import okhttp3.Cookie
import okhttp3.CookieJar
import okhttp3.HttpUrl

class SessionCookieJar : CookieJar {

    private val cookieStore = mutableListOf<Cookie>()

    override fun saveFromResponse(
        url: HttpUrl,
        cookies: List<Cookie>
    ) {
        cookieStore.removeAll { storedCookie ->
            cookies.any { newCookie ->
                storedCookie.name == newCookie.name &&
                        storedCookie.domain == newCookie.domain &&
                        storedCookie.path == newCookie.path
            }
        }

        cookieStore.addAll(cookies)
    }

    override fun loadForRequest(url: HttpUrl): List<Cookie> {
        val now = System.currentTimeMillis()

        cookieStore.removeAll { cookie ->
            cookie.expiresAt < now
        }

        return cookieStore.filter { cookie ->
            cookie.matches(url)
        }
    }

    fun clear() {
        cookieStore.clear()
    }
}