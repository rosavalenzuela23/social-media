<template>
  <div class="min-h-screen bg-base-100">
    <header class="navbar border-b border-base-300 px-4 lg:px-8">
      <div class="navbar-start">
        <RouterLink :to="{ name: 'home' }" class="btn btn-ghost text-xl" aria-label="Facecat home">
          <i class="bi bi-chat-heart-fill text-primary"></i>
          Facecat
        </RouterLink>
      </div>
      <nav class="navbar-end gap-2" aria-label="Account navigation">
        <RouterLink :to="{ name: 'login' }" class="btn btn-ghost btn-sm sm:btn-md"
          >Login</RouterLink
        >
        <RouterLink :to="{ name: 'register' }" class="btn btn-primary btn-sm sm:btn-md">
          Register
        </RouterLink>
      </nav>
    </header>

    <main>
      <section class="hero min-h-[70vh] bg-base-200">
        <div class="hero-content flex-col gap-12 py-16 lg:flex-row-reverse">
          <div class="card w-full max-w-sm bg-base-100 shadow-xl" aria-label="Conversation preview">
            <div class="card-body">
              <div class="chat chat-start">
                <div class="chat-header">Mia</div>
                <div class="chat-bubble">Anyone up for coffee this weekend?</div>
              </div>
              <div class="chat chat-end">
                <div class="chat-header">You</div>
                <div class="chat-bubble chat-bubble-primary">Count me in!</div>
              </div>
              <div class="divider">Facecat</div>
              <div class="stats stats-vertical bg-base-200 sm:stats-horizontal">
                <div class="stat place-items-center">
                  <div class="stat-title">Share</div>
                  <div class="stat-value text-primary">Stories</div>
                </div>
                <div class="stat place-items-center">
                  <div class="stat-title">Find</div>
                  <div class="stat-value text-secondary">People</div>
                </div>
              </div>
            </div>
          </div>

          <div class="max-w-xl text-center lg:text-left">
            <div class="badge badge-primary badge-outline">Your community, your feed</div>
            <h1 class="py-6 text-5xl font-bold lg:text-6xl">
              A friendlier place to stay connected.
            </h1>
            <p class="text-lg text-base-content/70">
              Share the moments that matter, discover people with your interests, and keep up with
              the friends who make every day better.
            </p>
            <div class="mt-8 flex justify-center gap-3 lg:justify-start">
              <RouterLink :to="{ name: 'register' }" class="btn btn-primary"
                >Join Facecat</RouterLink
              >
              <RouterLink :to="{ name: 'login' }" class="btn btn-outline"
                >I have an account</RouterLink
              >
            </div>
          </div>
        </div>
      </section>

      <section class="mx-auto grid max-w-5xl gap-4 px-4 py-16 md:grid-cols-3">
        <article class="card border border-base-300 bg-base-100">
          <div class="card-body">
            <i class="bi bi-people-fill text-3xl text-primary"></i>
            <h2 class="card-title">Meet your people</h2>
            <p>Build connections around the interests and conversations you care about.</p>
          </div>
        </article>
        <article class="card border border-base-300 bg-base-100">
          <div class="card-body">
            <i class="bi bi-images text-3xl text-secondary"></i>
            <h2 class="card-title">Share your world</h2>
            <p>Post updates, photos, and everyday moments without the noise.</p>
          </div>
        </article>
        <article class="card border border-base-300 bg-base-100">
          <div class="card-body">
            <i class="bi bi-heart-fill text-3xl text-accent"></i>
            <h2 class="card-title">Keep it social</h2>
            <p>React and join in with a community designed for real interaction.</p>
          </div>
        </article>
      </section>
    </main>

    <footer class="footer footer-center bg-base-200 p-8 text-base-content">
      <p>Facecat. Share more of what matters.</p>
    </footer>
  </div>
</template>
