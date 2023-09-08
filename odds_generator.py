import requests
import pandas as pd
from pandas import json_normalize
from datetime import datetime, timezone, timedelta

def get_odds(api_key, sport, regions, odds_format):
    url = f"https://api.the-odds-api.com/v4/sports/{sport}/odds/?apiKey={api_key}&regions={regions}&markets=h2h,spreads,totals&oddsFormat={odds_format}"
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Error getting odds: {response.text}")
        return None
    odds = response.json()
    return odds

# Your API key
api_key = 'ec69e5cbc27fa2a7cedaa9fe72164bdc'

# Get odds for 'basketball_wnba', for 'us' region and 'h2h' market, in American format
odds = get_odds(api_key, 'basketball_wnba', 'us', 'american')
if not odds:
    print("No odds data received")
    exit(1)

# ShotQuality API
token = 'b388db79-a73f-4dcc-ab7a-91a94968457a'
league = "wnba"
season = 2023
url = f"https://shotqualitybets.com/shotquality-data/api/v2/predicted_scores_data/{season}/{league}"
headers = {"apiKey": token}

resp = requests.get(url, headers=headers)
if resp.status_code != 200:
    print(f"Error getting projected scores: {resp.text}")
    exit(1)
projected_scores = resp.json()['data']

# Convert the data into a pandas DataFrame for easier manipulation
projected_scores_df = pd.json_normalize(projected_scores)

# Extracting data and populating the DataFrame
all_rows = []
for game_odds in odds:
    game_date = datetime.fromisoformat(game_odds['commence_time'].replace("Z", "+00:00"))
    game_date = game_date.replace(tzinfo=timezone.utc).astimezone(timezone(-timedelta(hours=7)))  # Convert to PDT
    projected_scores_row = projected_scores_df[(projected_scores_df['home'] == game_odds['home_team']) & (projected_scores_df['away'] == game_odds['away_team'])]
    if not projected_scores_row.empty:
        home_team_projected_score = round(projected_scores_row['projected_home_score'].values[0], 1)
        away_team_projected_score = round(projected_scores_row['projected_away_score'].values[0], 1)
        winner = game_odds['home_team'] if home_team_projected_score > away_team_projected_score else game_odds['away_team']
        wins_by_amount = round(abs(home_team_projected_score - away_team_projected_score), 1)
        all_rows.append({
            "Date": game_date.strftime('%A %B %d %Y %H:%M PDT'),
            "Match": f"{game_odds['home_team']} vs {game_odds['away_team']}",
            "Projected Score": f"{game_odds['home_team']} {home_team_projected_score} vs {game_odds['away_team']} {away_team_projected_score}",
            "Winner": winner,
            "Wins By": wins_by_amount
        })

results_df = pd.DataFrame(all_rows)

# Save the DataFrame to a CSV file in the public directory
results_df.to_csv("public/projected_scores.csv", index=False)
