# civ1-spaceship

A collection of `Rule`s and actions to provide a `Spaceship` experience close to that of the original Civilization.

## Spaceship component stats

### Mass

SS Structural   |  100
SS Fuel         |  400
SS Propulsion   |  400
SS Habitation   | 1600
SS Life Support | 1600
SS Solar Panel  |  400

This isn't technically correct as there are also 500 extra tons added to the overall weight over the first four and one further SS Structural pieces (I haven't yet ascertained if this is SS Structural pieces in specific locations or after a certain number are in situ...)

### Flight Time

This looks to be a calculation of Mass / Propulsion at first glance, although I need to look into this in more depth. Currently the following appears to fit the values

    Propulsion (p) | Mass (m) | Flight Time
    ---------------------------------------
                 0 |      200 |        10  
                 0 |     7100 |       375  
                 1 |     3400 |        15.4
                 1 |     3800 |        17.2
                 1 |     7500 |        34  
                 2 |     4400 |        10.4
                 2 |     6000 |        14.2
                 2 |     6800 |        16.1
                 2 |     6900 |        16.4
                 2 |     7900 |        18.8
                 3 |     8300 |        13.3
                 4 |     8700 |        10.6
                 5 |     9100 |         8.9
                 6 |     9500 |         7.7
                 7 |     9900 |         6.9
                 8 |    10300 |         6.3
                 8 |    13500 |         8.3
                 8 |    13900 |         8.5
                 8 |    15500 |         9.5
                 8 |    17100 |        10.5
                 8 |    17500 |        10.8
                 8 |    19100 |        11.7
                 8 |    20700 |        12.7
                 8 |    21100 |        13.0
                 8 |    22700 |        14.0
                 8 |    24300 |        15.0
                 8 |    24700 |        15.2

From these numbers it looks like flight time is a truncated (probably calculated as an int knowing how often that's the case in the game) something like this:

    (m / 20) / (1 + (p * 10))

### Chance of Success

The current implementation here is naiive and (I don't think...) the same as the original game. I'll take a look at this at some point.
