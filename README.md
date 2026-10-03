# SkyCast — Weather App for Argo CD GitOps Labs

SkyCast is a classroom-ready weather application. Students search any location, see **current conditions** plus a **7-day forecast**, and watch the background **animate to match the weather**. The same repo also contains the Docker image and Kubernetes manifests you need to teach **GitOps, application drift, and Argo CD auto-heal**.

Weather data comes from [Open-Meteo](https://open-meteo.com/), a free API that needs **no API key**. That keeps the lab simple: clone, run, and teach.

## What students see

- Location search with live city suggestions
- Optional “Use my location”
- Current temperature, feels-like, wind, humidity, pressure, sunrise/sunset
- Seven-day forecast
- Auto-animated scenes for clear, clouds, rain, drizzle, snow, fog, thunder, day, and night
- A version pill and ConfigMap banner you can change during GitOps exercises

## Project layout

```text
src/                 React UI
public/config.js     Runtime UI text (overridden by ConfigMap in Kubernetes)
Dockerfile           Multi-stage Node build + nginx image
docker-compose.yml   Local container run
k8s/                 Desired Kubernetes state
argocd/              Argo CD Application with automated sync + selfHeal
```

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Containerize

```bash
docker compose up --build
```

Open [http://localhost:8282](http://localhost:8282).

Build the class image yourself:

```bash
docker build -t skycast:1.0.0 .
docker run --rm -p 8282:80 skycast:1.0.0
```

`skycast:1.0.0` lives on your laptop, not on Docker Hub. Kind and minikube will fail with `ErrImagePull` / `insufficient_scope` until you copy the image into the cluster:

```bash
# kind — use your cluster name (this lab uses argocd-lab)
kind load docker-image skycast:1.0.0 --name argocd-lab
kubectl -n skycast rollout restart deploy/skycast

# minikube
minikube image load skycast:1.0.0
```

If you push to a registry, change `image:` in `k8s/deployment.yaml` to `your-registry/skycast:1.0.0` and set `imagePullPolicy: Always`.

## GitOps teaching model

Git is the source of truth. Argo CD continuously compares the **live cluster** with the YAML in `k8s/`.

| Idea | In this repo |
| --- | --- |
| Desired state | `k8s/deployment.yaml` (`replicas: 2`) and `k8s/configmap.yaml` |
| Sync | Argo CD applies Git to the cluster |
| Drift | Someone changes the cluster without changing Git |
| Auto-heal | `selfHeal: true` writes the Git state back onto the cluster |

The Argo CD Application is in `argocd/application.yaml` and already points at this GitHub repo:

`https://github.com/rajmohanb82/Argocd-App-Demo.git`

Apply it after the repo exists and the image is on the cluster:

```bash
kubectl apply -f argocd/application.yaml
```

Watch the app:

```bash
kubectl -n argocd get application skycast
kubectl -n skycast get deploy,pods,svc,cm
kubectl -n skycast port-forward svc/skycast 8282:8282
```

## Classroom lab

### Lab 1 — See the desired state

```bash
kubectl -n skycast get deploy skycast -o jsonpath='{.spec.replicas}{"\n"}'
```

Git says **2 replicas**. Argo CD should show **Synced** and **Healthy**.

### Lab 2 — Create drift, watch auto-heal

Scale the live deployment without touching Git:

```bash
kubectl -n skycast scale deploy/skycast --replicas=5
kubectl -n skycast get deploy skycast
```

Ask the class:

1. Is the cluster still the same as Git?
2. What does the Argo CD UI show? (`OutOfSync`)
3. What happens if you wait a few seconds with `selfHeal: true`?

Argo CD heals the deployment back to **2 replicas**. That is auto-heal.

```bash
watch -n 1 kubectl -n skycast get deploy skycast
```

### Lab 3 — ConfigMap drift

```bash
kubectl -n skycast edit configmap skycast-config
```

Change `title` or `labHint`, save, then refresh the app. If self-heal runs first, Git restores the original banner. That shows why “kubectl edit in production” does not last when GitOps is enforcing desired state.

### Lab 4 — Change Git on purpose

This is the correct way to change the app:

1. Edit `k8s/configmap.yaml` (`version: "1.1.0"`, new title, new banner).
2. Commit and push.
3. Argo CD syncs automatically.
4. Refresh the UI. The version pill and banner match Git.

### Lab 5 — Turn auto-heal off

In `argocd/application.yaml`:

```yaml
syncPolicy:
  automated:
    prune: true
    selfHeal: false
```

Commit, let Argo CD update the Application, then scale again:

```bash
kubectl -n skycast scale deploy/skycast --replicas=5
```

The app stays **OutOfSync** until a student clicks **Sync** or runs:

```bash
argocd app sync skycast
```

Put `selfHeal: true` back when the lesson is over.

## Teaching talking points

- Git is the contract. The cluster is only a live copy.
- `kubectl scale` and `kubectl edit` create drift.
- Argo CD detects drift by comparing live objects to rendered Git manifests.
- Auto-heal is not magic: it re-applies Git.
- A good change is a Git commit, not a one-off cluster edit.
- The weather UI makes the lab memorable, but the lesson is the desired-state loop.

## API notes

SkyCast calls Open-Meteo from the browser:

- Geocoding: `https://geocoding-api.open-meteo.com/v1/search`
- Forecast: `https://api.open-meteo.com/v1/forecast`

Classroom networks must allow those hosts. No secrets or API keys are stored in the image.

## License

Demo project for teaching. Weather data is provided by Open-Meteo under CC BY 4.0.
