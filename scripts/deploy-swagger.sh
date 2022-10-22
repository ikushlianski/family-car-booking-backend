# assumptions:
# - it runs from root dir with `npm run deploy:swagger`
# - you have ikushlianski.github.io repo near family-car-booking-app on the same machine

cp swagger.yaml ../ikushlianski.github.io/hondatrackerdevapi

cd ../ikushlianski.github.io/hondatrackerdevapi || (echo "Honda tracker API folder in Github Pages repo not found" && exit 1)

git add .

git commit -m "Deploy updated Honda Tracker Dev API"

git push


