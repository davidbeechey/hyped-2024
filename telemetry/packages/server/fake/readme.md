# Fake Data Generation Branch


<pre style="color: white">
<h3><strong>Project Structure</strong></h3>
<strong>data-gen</strong>/
| - <a href="#main">main.ts</a> // <em>runs the program</em>
| - <a href="#index">index.ts</a> // <em>handles imports and exports</em>
| - src/
|   | - sensors.ts // <em>self-contained file with classes describing sensor functionality</em>
|   | - sensorData.csv // <em>setup file defining sensor input params with read/write permissions</em>
| - utils/
|   | - data-manager.ts // <em>Singleton class structure used to track, update, upload and store data in real-time</em>
|   | - config.ts // <em>sets up the program and all objects & variables used within</em>
|   | - helpers.ts // <em>contains generic functions used throughout the project</em>
| - tests/ // <em>yet to be implemented</em>
| - tsconfig.json // <em>generic settings for ../server/ directory</em>
| - README.md
</pre>
<!-- package.JSON (add if needed) -->

### Types
New types are defined for this program:
<ul>
    <li><code>LiveMeasurement</code>: extends <code>RangeMeasurement</code>, adding the properties of <code>currentValue</code> and <code>timestep</code>, allowing the adapted use of prewritten data structures.</li>
    <li><code>SensorData</code>: <code>{ [x: string]: LiveMeasurement }</code>. This takes the sensor data and puts them back in the standard <code>Record< string, Measurement></code> format.</li>
    <li><code>StoredData</code>: <code>{ [key: string]: [(number | string)][] }</code>. This object has the sensors/measurements as keys, and at each sensors' timestep an array containing the time stamp and current value are pushed into the sensor's array. While data points will be uploaded in real-time, they are stored for recording and analysis purposes.</li>
    <li><code>InitialState</code>: <code>[key: string]: { dt: number; initialVal: number; }</code>. This interface defines the object which holds the user-specified properties. Again, the key is the sensor name. The user can read and write to a CSV file to specify any or all of the sensors' initial values and the time interval between their generated readings.</li>
</ul>

<span style="display: block; height: 2px; background-color: #bbb;"></span>

### Config
This setup stage imports nested `measurements` object from <code>pods.ts</code> data. The `rangeFilter` function filters this data into an array of only the measurement/sensor objects of type `RangeMeasurement`, and removes duplicate redundancy, then converts it back into an object of similar format to `measurements`. This makes the code readable and familiar. This new object is exported by default.

The array manipulation removes those without a `limits` property (i.e. of type `EnumMeasurement`), and converts all duplicates into equivalent strings to facilitate filtering e.g. 'thermistor_1', 'thermistor_2' -> both become 'thermistor'. Upon the ultimate conversion back into an object (the code uses `Object.fromEntries( Object.entries(measurements) )`), only one 'thermistor' entry is retained due to the JS Object prototype's inherent unique key characteristics.

Then the `readData` helper function is called. This function reads the CSV data, which consists of `[sensor/quantity, time interval, initial value]`. It returns a Promise, which resolves if the resulting object (of type `InitialState`) is not empty. The result is chained to a `then` block, which requires that `unqSensorObj[sensor].currentValue = response[sensor].initialVal`, ensuring the CSV data has the correct sensor names and number of rows.

<!-- <em>For more assurance, this can be changed to reject the Promise if the object doesn't have the expected number of sensors.</em> -->

<span style="display: block; height: 1px; background-color: #bbb;"></span>


### Index
Gathers and exports all exports from relevant project files for ease of access

<span style="display: block; height: 1px; background-color: #bbb;"></span>


### Sensors
Self-contained module containing classes for the different sensor/measurement categories (Navigation, Pressure etc.). Each subclass inherits from the parent Sensor class, reducing repetitive code. The amount of different classes is as small as possible, each combined into groups of similar functionality.

Classes are instantiated once each in `main.ts`. The Sensor class is constructed with a single `LiveMeasurement` sensor object, and its properties are set as `protected readonly`, allowing sub-classes to access them but placing a data barrier from external functions to access or modify these values.

The `_currentValue` variable is mutable, so that only a single instance per class is needed, updating its current value.

Not all sensors/measurements require their own class instance. For instance, in the navigation category only velocity (or the accelerometer reading) needs to be recorded in the class instance. From this value and given a reasonable function of time, the other navigation variables can be calculated accordingly at each time step using basic kinematics and calculus of limts. Additionally, many other measurements have a dependency on pod velocity, generally increasing in proportion to the speed. Temperature is another measurement which dictates certain others, like reservoir pressure for example.

<span style="display: block; height: 1px; background-color: #bbb;"></span>


### Data Manager

<span style="display: block; height: 1px; background-color: #bbb;"></span>


## Main
Main functional file. After importing all necessary objects, classes and functions, it runs the `GenerateDataSeries` iterative function, updating the `DataManager` instance at each iteration.

Imports the adapted `rangeSensors` object from `config.ts` as well as the Sensor class and its sub-classes from `sensors.ts`, which each consist of similar functionality shared by a category of sensors such as Navigation, Pressure etc.

Runs the main loop with user-defined parameters, with the actual functionality and data management in the other files.


<span style="display: block; height: 2px; background-color: #bbb;"></span>


## To-do list

<ol id="todo">
    <li style="color: #61E786">Complete <code style="color: #61E786">config.ts</code></li>
    <li style="color: #DB5461">Read the sensor specs for more info to use to estimate functionality specifics, estimated noise reduction quality, etc. to make the data generation more reflective of reality. Add more sensor properties if appropriate.</li>
    <li style="color: #DB5461">Update current pod measurements data with any new changes from the sensor spec sheet</li>
    <li style="color: #D46B0F">Add general functionality</li>
    <ul>
        <li style="color: #61E786">Write an async function for user to read sensor parameters CSV</li>
        <li style="color: #D46B0F">Write an async function for user to modify CSV sensor parameters</li>
        <li style="color: #DB5461">Write function to optimise data generation complexity for any given set of user-defined sensor reading time steps</li>
        <li style="color: #DB5461">Broadcast data live to an animated GUI graph</li>
        <li style="color: #DB5461">Write a function to generate noise</li>
        <li style="color: #DB5461">Write an exponential moving average method with parameters <em>alpha</em> and <em>window (amount of recent data points to average)</em></li>
    </ul>
    </li>
    <li style="color: #D46B0F">Complete <code style="color: #D46B0F">sensors.ts</code>
    <ul>
        <li style="color: #D46B0F">Create logical functions for next data points for all sensor groups</li>
        <li style="color: #DB5461">Categorise sensors with similar data functionality (by that I mean the nextValue method) into the same class, e.g. class TempDependent, VelocityDependent, Pressure etc.</li>
    </ul>
    </li>
    <li style="color: #DB5461">Complete <code style="color: #DB5461">data-manager.ts</code>
    <ul>
        <li style="color: #61E786">Create data storage functionality and object interface</li>
        <li style="color: #D46B0F">Change data access methods to <code>get</code> and <code>set</code></li>
        <li style="color: #DB5461">Import and connect to mqtt server</li>
        <li style="color: #DB5461">Upload data values to server within the <code>updateData</code> method</li>
    </ul>
    </li>
    <li style="color: #D46B0F">Complete <code style="color: #D46B0F">main.ts</code>
    <ul>
        <li style="color: #D46B0F">Change main function to interact with Sensor classes, not Behaviour (old version's file)</li>
        <li style="color: #61E786">Provide user freedom to modify parameters:
        <ul>
            <li style="color: #61E786">Data generation type: random/logical</li>
            <li style="color: #61E786">Sensor-specific time intervals at which readings are generated</li>
            <li style="color: #61E786">Total runtime for the data generation loop</li>
        </ul>
        </li>
        <li style="color: #D46B0F">Instantiate sensor classses and finish loop functionality</li>
        <li style="color: #D46B0F">Add functionality for cases of different timesteps for different sensors which may depend on each other
        <ul>
            <li style="color: #61E786">Plan the logic conceptually</li>
            <li style="color: #DB5461">Program it into the loop</li>
        </ul>
        </li>
    </ul>
    <li style="color: #61E786">Create logical and modular file structure <em>(separation of concerns)</em></li>
    <li style="color: #aaa">Refactor:
    <ul>
        <li style="color: #aaa">Minimise code and amount of classes as much as possible</li>
        <li style="color: #aaa">Review file structure and ensure it is logical, readable and non-repetitive</li>
    </ul>
    <li style="color: #aaa">Remove comments</li>
    </ul></em></li>
</ol>

<style>
    ol#todo {
        list-style-type: none;
        counter-reset: my-counter;
    }

    ol#todo>li::before {
        content: counter(my-counter);
        counter-increment: my-counter;
        color: white;
        margin-right: 0.5em;
    }
</style>


- Add functionality to DataManager to upload live values [ ]
- Change stored data into an object of 2D arrays which store the timestamp and the value at said time for each object
- Add flexibility with user input via read/write to csv file with data parameters [ ]


#### Features to be added
<ul>
    <li>Prompt user to edit time steps for each sensors' readings as desired:</li>
    <ol>
        <li>Print all sensors along with their default time step</li>
        <li><code>> Edit timesteps? [y/n]</code></li>
        <li>If 'y', cycle through each sensor and ask: <code>>[<em>sensor name</em>]: enter preferred timestep in ms (e.g. 500) or press Enter to move to next sensor</code></li>
        <li>Update initial conditions object with any altered timesteps</li>
    </ol>
    <li>Prompt user to edit initial conditions by uploading a csv file or changing specific values through command prompt</li>
<ul>


<!-- First prompt user if they want to set ICs or keep as is
If they want to keep as is, use the object below
Otherwise, print the file
Ask user which to edit
Write to file with changes
Read from file and set new ones as ICs in object below -->

<span style="display: block; height: 1px; background-color: #bbb;"></span>





## Next Steps

<ol>
    <li>Code in the noise. Shouldn't be difficult, just use a function based on Math.random and weight the amplitude of the noise to some extent. Decide whether how 'noisy' data is might be dependent upon certain vasriables such as speed. I'm not sure so ask GPT or research this.</li>
    <li>Create moving average function with ```window``` parameter set to 5 as default. Look into exponential moving average too. The average value will be used to determine whether a reading is out of bounds or it's just the noise.</li>
    <li>Find out how the noise levels compare from different sensors e.g. thermistors, pressure gauges, digital sensors, navigation etc.</li>
    <li>Create a simple function for <strong>reservoir pressure</strong>, it will not vary by much, but increase with temperature slightly. Reading will have some noise.</li>
    <li>Write functions for the other pressures. Push = acceleration, so front pressure goes up and back goes down (both go further away from atmospheric, their absolute gauge pressure increases). And pull = decelleration, so the opposite. Also double check with David that you're interpreting the pressure variable terms correctly.</li>
    <li>I am assuming that the accelerometer(s) are all supposed to measure the absolute pod acceleration with respect to a stationay observer, and that's how the navigation parameters are found. Except this assumption seems wrong, as the accelerometer has a range of -150 to 150 m/s^2 while acceleration can only go up to 5 m/s^2. Is this perhaps referring to the sensors' physical limits of its capability to read acceleration, while the pod itself is not built to exceed 5m/s^2? In other words, the accelerometer will be limited to the 0-5 range, it's just not "critical" for the sensor in terms of safety, it's critical for the pod's safety. Perhaps. But another uncertainty is that the pod's acceleration can be easily determined by it's speed, which - <em>I assume</em> - we are controlling. <strong><em>Update: wrong, we are not controlling speed. We just switch on the power and track it using the accelerometer. The sensor's operational range is +-150. Above 150 it won't read the acceleration accurately. The pod cannot exceed 5.</em></strong> We have one sensor to measure navigation quantities, and that's the accelerometer. It has an operating range of -150 to 150. This specific pod prototype, Pod Ness, has an operating acceleration range of 0 to 5 (presumably this means -5 to 5). We generate fake data for the accelerometer sensor, and analyse it with the view of keeping pod acceleration below 5, and we also calculate other navigation quantities starting from acceleration.</li>
</ol>
<hr>

<ol>
    <strong>Thursday notes from discussion with David + discussion with Damen about the public app, React and Three.js</strong><hr>
    <li><strong>Seperate all sensor data into its own file. This sensor data structure will be like the one in pods, but reduced to the data-gen relevant sensors, and with added/removed properties. Outside of this file, no other functional part of the program will be able to modify or access the file. The data file will be imported. Its properties are constant (so no 'currentVal' or 'movingAvg'). They are properties inherent to the sensor, like with the pod object. A new property David would like is a sampling rate property. This will define the delta T for that sensor's data generation, giving us a lot more freedom and making the code run a lot quicker as right now, there's only one global delta T variable so if we needed say 0.05s, all variables would be measured twenty times per second which would be unnecessary and slow. Of course, the value of this property will be changed and modified by our team, but not during runtime. This is a fixed object which is exporting its data for the data generation function to run. Another object or array will store the transient values, which we will also send live to the server as they are calculated and a graph can be animated in real time.</strong></li>
    <li>One issue I foresee is that if different sensors have different delta Ts, it will make the main loop more complicated. Say the thermistor takes a reading every 0.2s. The accelerometer every 0.5s. So we'd run the loop ever 0.2, while checking if the time is also a multiple of 0.5 (and all the other sensors' times). To mitigate this slightly, I will add functionality to the ```specific``` parameter, so we can view a select few variables in one run, or all of them if we want to.</li>
    <li>Different sensors will have a new property which defines its time interval (dt) and perhaps its degree of noise (as higher quality sensors would have less noise due to better electronic circuits)</li>
    Separate the sensor file into a new file with the sensor object and its properties relevant to the data generation
    <li>The fake data generation program will be placed into its own directory</li>
    <li>It's only for internal use, but there are restrictions/rules we need to follow from EHW committee</li>
    <li>Add a method to the data manager class to upload the data at each step of the iteration to the server/mqtt so we can view it live (graph animation)</li>
    <li>We don't have complete or current data on all the sensors we're using   and we'll need to ask electronics team to fill in a spreadsheet with the data for range limits, (critical and warning and expected/nominal levels)</li>
    <li>Run the logical data gen methods past the electronics/other team to see if they agree it makes sense</li>
</ol>


<!-- - [ ] <code style="color: #61E786">**config.ts**</code>
    - [ ] Write an async method for user to read sensor parameters CSV
    - [ ] Write an async method for user to modify CSV sensor parameters
    - [ ] Create logical and modular file structure <em>(separation of concerns)</em>
<hr>

- [ ] <code style="color: #D46B0F">**sensors.ts**</code>
    - [ ] Create logical functions for next data points for all sensor groups
    - [ ] Categorise sensors with similar data functionality into the same class, e.g. class TempDependent, VelocityDependent, Pressure etc. 

<hr>

- [ ] <code>**data-manager.ts**</code>

<hr>

- [ ] <code>**main.ts**</code><br>
    - [ ] Change main function to interact with Sensor classes, not Behaviour (old version's file)
    - [ ] Provide user freedom to modify parameters:
        - [ ] Data generation type: random/logical
        - [ ] Sensor-specific time intervals at which readings are generated
        - [ ] Total runtime for the data generation loop
    - [ ] Instantiate sensor classes and finish loop functionality
    - [ ] Add functionality for cases of different time steps for different sensors which may depend on each other
    - [ ] Plan the logic conceptually
    - [ ] Program it into the loop

<hr>



- [ ] **Refactor**:
    - [ ] Minimise code and amount of classes as much as possible
    - [ ] Review file structure and ensure it is logical, readable and non-repetitive
    - [ ] Remove comments -->