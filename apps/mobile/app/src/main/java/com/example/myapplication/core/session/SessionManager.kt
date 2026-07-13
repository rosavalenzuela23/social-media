package com.example.myapplication.core.session

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map

private val Context.dataStore by preferencesDataStore(
    name = "session"
)

class SessionManager(
    private val context: Context
) {
    private val userUuidKey =
        stringPreferencesKey("user_uuid")

    val userUuidFlow = context.dataStore.data.map { preferences ->
        preferences[userUuidKey]
    }

    suspend fun saveUserUuid(userUuid: String) {
        context.dataStore.edit { preferences ->
            preferences[userUuidKey] = userUuid
        }
    }

    suspend fun getUserUuid(): String? {
        return userUuidFlow.first()
    }

    suspend fun clearSession() {
        context.dataStore.edit { preferences ->
            preferences.remove(userUuidKey)
        }
    }
}