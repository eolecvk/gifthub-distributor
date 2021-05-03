package host.techcoop.gifthub;

import static spark.Spark.*;


public class Main {
    public static void main(String[] args) {
        staticFiles.location("/public");
        get("/hello", (req, res) -> "Hello World");
    }
}
