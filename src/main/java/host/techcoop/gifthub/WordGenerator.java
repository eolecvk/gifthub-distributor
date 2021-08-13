package host.techcoop.gifthub;

import com.google.common.collect.ImmutableList;
import com.google.inject.Inject;
import com.google.inject.name.Named;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Random;

public class WordGenerator {

  private final ImmutableList<String> words;
  private final Random random;

  @Inject
  public WordGenerator(@Named("WordFile") File wordFile) {
    random = new Random();
    try {
      words =
          Files.lines(wordFile.toPath())
              .filter(word -> word.length() > 3)
              .filter(word -> word.toLowerCase().equals(word))
              .collect(ImmutableList.toImmutableList());
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  public String getWords(int numOfWords, String joiningCharacter) {
    return random
        .ints(numOfWords, 0, words.size())
        .mapToObj(x -> words.get(x))
        .reduce((a, b) -> a + joiningCharacter + b)
        .get();
  }
}
