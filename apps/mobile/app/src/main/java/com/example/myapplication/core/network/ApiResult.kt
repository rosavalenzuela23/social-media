package com.example.myapplication.core.network

import retrofit2.Response

sealed interface ApiResult<out T> {
    data class Success<T>(val data: T) : ApiResult<T>
    data class Error(val message: String, val code: Int? = null) : ApiResult<Nothing>
}

suspend inline fun <T> safeApiCall(
    crossinline call: suspend () -> Response<T>
): ApiResult<T> {
    return try {
        val response = call()
        val body = response.body()

        if (response.isSuccessful && body != null) {
            ApiResult.Success(body)
        } else {
            ApiResult.Error(
                message = response.errorBody()?.string() ?: "Error en la petición",
                code = response.code()
            )
        }
    } catch (e: Exception) {
        ApiResult.Error(e.message ?: "Error de conexión")
    }
}
